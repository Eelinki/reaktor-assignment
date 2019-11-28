import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

class Package extends React.Component {
  componentDidMount() {
    document.title = 'Packages - ' + this.props.p.Package;
  }

  componentDidUpdate() {
    document.title = 'Packages - ' + this.props.p.Package;
  }

  render() {
    return (
      <div>
        <h1>{this.props.p.Package}</h1>
        
        <h2>Description</h2>
        <h3>{this.props.p.Description.split('\n', 1)[0]}</h3>
        <pre>{this.props.p.Description.substring(this.props.p.Description.indexOf('\n')+1)}</pre>
        
        <h2>Dependencies</h2>
        <ul>
          {this.props.p.Depends ?
            (
              this.props.p.Depends.map((item) => (
                <li key={item}>
                  <Link to={`/package/${item}`}>
                    {item}
                  </Link>
                </li>
              ))
            ) : (
              <p>No dependencies</p>
            )
          }
        </ul>

        <h2>Required By</h2>
        <ul>
          {this.props.r ?
            (
              this.props.r.map((item) => (
                <li key={item}>
                  <Link to={`/package/${item}`}>
                    {item}
                  </Link>
                </li>
              ))
            ) : (
              <p>No reverse dependencies</p>
            )
          }
        </ul>
      </div>
    );
  }
}

export default Package;