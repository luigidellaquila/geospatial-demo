# Demo project to demostrate OrientDB geospatial capabilities

how to install:

1. Download OrientDB (v. 2.2.x or above) ([http://www.orientdb.com](http://www.orientdb.com)) and install the geospatial plugin [http://orientdb.com/docs/2.2/Spatial-Index.html](http://orientdb.com/docs/2.2/Spatial-Index.html)
2. clone current project (or download it)
3. Edit index.html file and insert your Google Maps API Key
4. in the root directory of the project, run 

  ```
  npm install
  tsc
  ```
  (you need NPM and Typescript stuff installed)
5. create a symbolic link in OrientDB /www directory to the root of this project, eg.

  ```
  cd OrientDB/www/
  ln -s root/to/this/project/ ui
  ```
6. Start OrientDB and create a DB called `geo`
7. Execute the following statements in OrientDB

  ```
   CREATE CLASS POI EXTENDS V
   CREATE PROPERTY POI.location EMBEDDED OPoint
   create index POI.location on POI(location) SPATIAL ENGINE LUCENE	
   
   CREATE CLASS Natural EXTENDS V
   CREATE PROPERTY Natural.location EMBEDDED OPolygon
   CREATE INDEX Natural.location on Natural(location) SPATIAL ENGINE LUCENE	

   CREATE CLASS Person EXTENDS V
   CREATE PROPERTY Person.location EMBEDDED OPoint
   
   CREATE CLASS FriendOf EXTENDS E
  ```
8. In your browser, open [http://localhost:2480/ui/index.html](http://localhost:2480/ui/index.html)
9. To load POI and Natural data, you can use [https://github.com/luigidellaquila/wkt-to-orient](https://github.com/luigidellaquila/wkt-to-orient)

Acknowledgements:

This project is derived by Angular quick-start project (https://github.com/angular/quickstart)


