import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Package from './Package';
import Parser from './Parser';

const App = () => {
  const [packages, setPackages] = useState(null);
  const [deps, setDeps] = useState(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/status.real')
    .then((r) => r.text())
    .then(text  => {
      let p = new Parser();
      let parsed = p.parse(text);
      setPackages(parsed.packages);
      setDeps(parsed.deps);
    });
  }, []);

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

export default App;