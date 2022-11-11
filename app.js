const mysql = require("mysql");
const express = require("express");
cors = require("cors");

let app = express();


// Middle ware to have access to the frontend
app.use(cors());
app.use(express.json());



let port = 430;

app.listen(430, (err) => {
  if (err) console.log(err);
  console.log(`connected to port ${port}`);
});

// Middle ware to extract info from the html
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Middle ware to have access to the frontend
app.use(cors());
app.use(express.json());

let connection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "evangadi",
  database: "mydb",
});

// connection.connect(console.log("connected"));

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// Table created

app.get("/table", (req, res) => {
  let productTable =
    " CREATE TABLE IF NOT EXISTS Product(product_id INT AUTO_INCREMENT PRIMARY KEY,product_url VARCHAR(255) not null, product_name VARCHAR(255) NOT NULL  )";
  connection.query(productTable, function (err, result) {
    if (err) throw err;
    console.log("Table Product created");
  });

  let productDescription =
    " CREATE TABLE IF NOT EXISTS productDescription(description_id INT AUTO_INCREMENT PRIMARY KEY,product_brief_description VARCHAR(255) NOT NULL, product_description VARCHAR(255) NOT NULL, product_img VARCHAR(255),product_link VARCHAR(255),product_id int, FOREIGN KEY (product_id) REFERENCES Product(product_id) )";

  connection.query(productDescription, function (err, result) {
    if (err) throw console.log(err);
    console.log("Table productDescription created");
  });

  let ProductPrice =
    "CREATE TABLE IF NOT EXISTS ProductPrice(price_id INT AUTO_INCREMENT PRIMARY KEY,starting_price VARCHAR(255),price_range VARCHAR(255),product_id INT, FOREIGN KEY (product_id) REFERENCES Product(product_id))";

  connection.query(ProductPrice, function (err, result) {
    if (err) throw console.log(err);
    console.log("Table ProductPrice created");
  });

  let User =
    "CREATE TABLE IF NOT EXISTS User(user_id INT AUTO_INCREMENT PRIMARY KEY,User_name VARCHAR(255),User_password VARCHAR(255))";

  connection.query(User, function (err, result) {
    if (err) throw console.log(err);
    console.log("Table User created");
  });

  let Orders =
    "CREATE TABLE IF NOT EXISTS Orders(order_id INT AUTO_INCREMENT PRIMARY KEY,product_id int,user_id INT,FOREIGN KEY (product_id) REFERENCES Product(product_id),FOREIGN KEY (user_id) REFERENCES User(user_id))";

  connection.query(Orders, function (err, result) {
    if (err) throw console.log(err);
    console.log("Table User created");
  });
  res.end("Created");
});



// add product
app.post("/add-product", (req, res) => {
  console.table(req.body);
  const {
    product_url,
    product_name,
    productBriefDescription,
    productDescription,
    productimg,
    productLink,
    StartingPrice,
    PriceRange,
    UserName,
    UserPass,
  } = req.body;

  //insert product table

  let insert_url = `INSERT INTO Product(product_url,product_name) VALUES (' ${product_url}', '${product_name}')`;

  connection.query(insert_url, (err, result, fields) => {
    if (err) console.log(`Error Found: ${err}`);
    console.log(result);
  });

  // getID and getUserId
  let getMeTheId = `SELECT product_id FROM Product WHERE product_name = "${product_name}" `;
 

  connection.query(getMeTheId, (err, result, fields) => {
    if (err) console.log(`Error Found: ${err}`);

    // IF added product is there

    console.log(result[0].product_id);
    console.log(result);
    let addedId = result[0].product_id;
    console.log(addedId);

    // insert P_desc

    if (addedId != 0) {
      let insert_pd = `INSERT INTO productDescription(product_brief_description,product_description,product_img,product_link,product_id) VALUES("${productBriefDescription}","${productDescription}","${productimg}","${productLink}","${addedId}") `;

      connection.query(insert_pd, (err, result, fields) => {
        if (err) console.log(err);
      });

       // insert ProductPrice
      let insert_pp = `INSERT INTO ProductPrice(starting_price,price_range,product_id) VALUES("${StartingPrice}","${PriceRange}","${addedId}") `;

      connection.query(insert_pp, (err, result, fields) => {
        if (err) console.log(err);
      });

      // insert user
      let insert_user = `INSERT INTO User(User_name ,User_password) VALUES("${UserName}","${UserPass}") `;

      connection.query(insert_user, (err, result, fields) => {
        if (err) console.log(err);
      });

       
    }

  // insert Order
     let userId = `SELECT user_id FROM User WHERE  User_name ="${UserName}" `;
      connection.query(userId, (err, result, fields) => {
        if (err) console.log(err);
        let addedUserId = result[0].user_id;

        if (addedUserId != 0) {
          let Insert_Order = `INSERT INTO Orders( product_id,user_id) VALUES("${addedId}","${addedUserId}") `;

          connection.query(Insert_Order, (err, result, fields) => {
            if (err) console.log(err);
          });
        }
      });
  
  });
  

  res.end("Data inserted to tables");
  console.log("Data inserted to tables");
});

// update userName and passWord

app.put('/update',(req,res)=>{
  console.table(req.body);
  const {id,UserName,UserPass} =req.body;
  console.log(id);
  console.log(UserName);
  console.log(UserPass);

let updateName = `UPDATE User SET User_name = '${UserName}' WHERE user_id = '${id}'`;
let UpdatedPassword = `UPDATE User SET User_password = '${UserPass}' WHERE user_id = '${id}'`;

	connection.query(updateName, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) updated");
		
	});
  connection.query(UpdatedPassword, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) updated");
		
	});


  console.log("updated");

})