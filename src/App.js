import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Package from './Package';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: null,
      deps: null
    };
  }

  componentDidMount() {
    fetch(process.env.PUBLIC_URL + '/status.real')
    .then((r) => r.text())
    .then(text  => {
      this.loadPackages(text);
    });
  }

  render() {
    const { packages, deps } = this.state;
    if(packages && deps) {
      return (
        <Router>
          <div className="main">
            <Switch>
              <Route exact path="/package/:packageName" render={({ match }) => (
                <Package r={deps[0].get(match.params.packageName)}
                  p={packages.find(p =>
                    p.Package === match.params.packageName)} />
              )}/>
              <Route path="/">
                <h1>Installed packages</h1>
                <ul>
                  { packages ?
                    (
                      packages.map((item) => (
                        <li key={item.Package}>
                          <Link to={`/package/${item.Package}`}>
                            {item.Package}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <p>Loading</p>
                    )
                  }
                </ul>
              </Route>
            </Switch>
          </div>
        </Router>
      );
    }
    return (
      <p>Loading</p>
    );
  }

  loadPackages(data) {
    // Format raw text into objects
    let packages = [];
    let deps = new Map();

    let re = /(.+?(?=\n[^ ]))|(.+)/gis;

    for (let p of data.trim().split('\n\n')) {
      let pack = {};
      for (let pl of p.match(re)) {
        // Handle dependencies separately
        if(pl.split(':', 1)[0].trim() === "Depends") {
          pack[pl.split(':', 1)[0].trim()] = [];
          for (let d of pl.split(':')[1].trim().split(',')) {
            let dep = d.trim().split(' ', 1)[0];
            if(pack['Depends'].indexOf(dep) === -1) {
              pack['Depends'].push(dep);
              // Update reverse dependencies
              if(deps.get(dep) == null) {
                deps.set(dep, [pack.Package]);
              } else {
                let arr = deps.get(dep);
                arr.push(pack.Package);
                deps.set(dep, arr);
              }
            }
          }
          continue;
        }

        pack[pl.split(':', 1)[0].trim()] =
          pl.substring(pl.indexOf(':')+1).trim();
      }
      packages.push(pack);
    }

    packages.sort((a, b) => (a.Package > b.Package) ? 1 : -1);

    this.setState({ packages: packages });
    this.setState({ deps: [deps] });
  }
}

export default App;