**Poe StrongBox**

Allows easy analysis of Path of Exile exchange rates and assists in discovering trading opportunities.

This is now on github because I wrote it when I was bored after work and wanted to have a bit of fun. It was never built with the intention of being shared so yes there is some crap in here but its now out there for anyone to experiment with :)

---

**SETUP**

1: Go to ~/database.json and set up your local/live databases.

* Your databases MUST include a database called 'migrations'.

2: Install npm packages

* cd to root of project
* ~: npm install gulp db-migrate -g
* ~: npm install
* ~: db-migrate up

3: Build the clientside stuff

* ~: gulp app

4: Go into the 'leagues' database table and add the league you want to scan. The name of the league must match the league name in the query string used to fetch the data from poe.trade

---

**CREATING NEW MIGRATIONS**

* ~: db-migrate <camelCaseMigrationName> --sql-file

Modify the produced up SQL to implement the schema changes.
Modify the produced down SQL to reverse the schema changes.

---

Copyright 2018 Exgaves

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
