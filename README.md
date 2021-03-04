# portal-cli-app

## Features

### Show
Show (preview) data locally. 
I have a dataset `my-data` with the following content:
```
README.md
data.csv
## descriptor is optional (we infer if not there) 
# datapackage.json
```
I can do the following:
```
cd my-data
portal show
```
I get a nice dataset page like:
The single show command gives me access to the following:

* Elegant presentation
* Shows the data in a table etc (searchable / filterable)
* Supports other data formats e.g. json, xlsx etc
* Show graphs
* Data summary

Show works with: 
* README + csv
* Frictionless dataset
* Frictionless resource
* Pure README with frontmatter
 

### Deploy
Deploy enables you to easily publish your dataset online. 
If i have a dataset `my_data`:
```
cd my-data
portal deploy
```
Gives me a url like: 
 
`Myusername-my-dataset.datahub.io`

Deploy: what does it do?
* Deploys a shareable url with the content of show
    * Semi-private
    * Can integrate access control (?)
* Deploys a data API
* [Other integrations e.g. push to google spreadsheets]
* Dashboard showing your DataHub/Portal projects


