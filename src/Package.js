import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const Package = (props) => {
  useEffect(() => {
    if(props.p != null)
      document.title = 'Packages - ' + props.p.Package;
  });

  if(props.p == null) {
    return (
      <div>
        <p>Package not installed</p>

        <Link to={'/'}>Go back</Link>
      </div>
    );
  }
  return (
    <div>
      <h1>{props.p.Package}</h1>
      
      <h2>Description</h2>
      <h3>{props.p.Description.split('\n', 1)[0]}</h3>
      <pre>{props.p.Description.substring(props.p.Description.indexOf('\n')+1)}</pre>
      
      <h2>Dependencies</h2>
      <ul>
        {props.p.Depends ?
          (
            props.p.Depends.map((item) => (
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
        {props.r ?
          (
            props.r.map((item) => (
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

export default Package;