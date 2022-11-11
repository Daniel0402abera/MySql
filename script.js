let formSubmit = (e) => {
	e.preventDefault();
	return fetch("http://localhost:430/add-product", {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			product_url: document.querySelector("#myForm input[name=product_url]").value,
			product_name: document.querySelector("input[name=product_name]").value,

            
		}),
        
	})
		.then((response) => response.json())
		.then((data) => alert("product_name Added!"));
}