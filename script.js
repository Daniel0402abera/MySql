let formSubmit = (e) => {
	e.preventDefault();
	return fetch("http://localhost:430/update", {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			id: document.querySelector("#update input[name=UserId]").value,
			UserName: document.querySelector("input[name=UpdatedName]").value,
			UserPass: document.querySelector("input[name=UpdatedPassword]").value,

            
		})
        
	})
		.then((response) => response.json());
}

document.getElementById("update").addEventListener("submit", formSubmit);

