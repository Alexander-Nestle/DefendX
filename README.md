<h1 align="center">
  <br>
  <img src="/doc/banner.png" alt="DefendX" width="900">
</h1>

<h4 align="center">An ID Card Management tool.</h4>

<p align="center">
  <a href="#tech">Tech</a> •
  <a href="#installation">Installation</a> •
  <a href="#features">Features</a> •
  <a href="#signature">Signature</a>
</p>

### ID Card Management tool
DefendX is an ID card management software platform that was originally created to manage driver licenses of U.S. military personnel overseas, however, could be adapted to manage any credential.

### Tech
*   Angular
*   ASP.NET Core
*   Entity Framework
*   SQL Server

## Installation
### Prerequisites

In order for DefendX to run on your system, you will need the following installed:

*   [Angular](https://angular.io/guide/setup-local)
*   [ASP.NET Core](https://dotnet.microsoft.com/download)
*   [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) 
*   [Git](https://git-scm.com)

Note: The use of another database management system is possible by refactoring Startup.CS in API  

### Single Page Application (SPA)
```bash
# Clone this repository
$ git clone https://github.com/amitmerchant1990/electron-markdownify

# Go into the SPA
$ cd DefendX/DefendX-SPA

# Install dependencies
$ npm install
```

### Application programming interface (API) 
```bash
# Clone this repository if not yet cloned
$ git clone https://github.com/amitmerchant1990/electron-markdownify

# Go into the repository
$ cd DefendX/DefendX.API

# Install dependencies
$ dotnet restore
```

### Database Configuration
1. Edit the connection string in the appsettings.json file in the API
```json
  "ConnectionStrings": {
    "DevelopmentConnection": "Server=127.0.0.1,1433; Database=DefendXDB; Uid=SomeUserID; Pwd=SomePassword"
  }
```

2. Verify the connection key in the Startup.CS file of the API matches the key in the appsettings.json
```csharp
services.AddDbContext<DataContext> (x => x.UseLazyLoadingProxies().UseSqlServer (Configuration.GetConnectionString ("DevelopmentConnection")));
```

3. Run the following CLI commands
```bash
# Go into the repository
$ cd DefendX/DefendX.API

# Run Entity Framework database migrations
$ dotnet ef database update
```

## Features

*   Role-based access control
*   License CRUD functions
*   Account management
*   User profile customization
*   Email account privilege requests
*   NgRx client store

## Signature
DefendX using a desktop application called DefendXSig to enable the capturing of signatures from digital pads.  The desktop application is activated by DefendX using a Windows Registry call.

```powershell
Registry::HKEY_CLASSES_ROOT\defendxsig\shell\open\command <absolute file path to DefendXSig>
```
The desktop application, DefendXSig, saves a .SIG file to the local file system, which then is uploaded to the DefendX web application.  This method was chosen over a web extension to avoid problems introduced by corporate system security. 
