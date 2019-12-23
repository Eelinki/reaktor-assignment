class Parser {
  constructor() {
    this.deps = new Map();
  }

  parse(data) {
    // Format raw text into objects
    let packages = [];

    let re = /(.+?(?=\n[^ ]))|(.+)/gis;

    data.trim().split('\n\n').forEach((p) => {
      let pack = {};
      p.match(re).forEach((pl) => {
        // Handle dependencies separately
        if(pl.split(':', 1)[0].trim() === "Depends") {
          pack['Depends'] = this.handleDeps(pl, pack.Package);
        } else {
          pack[pl.split(':', 1)[0].trim()] =
            pl.substring(pl.indexOf(':')+1).trim();
        }
      });

      packages.push(pack);
    });

    packages.sort((a, b) => (a.Package > b.Package) ? 1 : -1);

    return { packages: packages, deps: [this.deps] };
  }

  handleDeps(data, packageName) {
    let dependencies = [];

    data.split(':')[1].trim().split(',').forEach((d) => {
      let dep = d.trim().split(' ', 1)[0];
      if(dependencies.indexOf(dep) === -1) {
        dependencies.push(dep);

        // Update reverse dependencies
        if(this.deps.get(dep) == null) {
          this.deps.set(dep, [packageName]);
        } else {
          let arr = this.deps.get(dep);
          arr.push(packageName);
          this.deps.set(dep, arr);
        }
      }
    });

    return dependencies;
  }
}

export default Parser;