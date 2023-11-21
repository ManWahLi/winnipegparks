/****************************************

	Name: Man Wah Li
	Date: Jun 27, 2022
	Description: AJAX Using Open Data

 ****************************************/

const url = 'https://data.winnipeg.ca/resource/tx3d-pfxq.json?';
const columns_name = ["Park name", "Location", "Community centre areas", "Total area in hectares"];

document.addEventListener("DOMContentLoaded", load);

function load()
{
	let form = document.getElementsByTagName("form")[0];
	let sampleQueries = document.getElementsByClassName("query");

	form.addEventListener("submit", search);

	for(var i = 0; i < sampleQueries.length; i++)
	{
		sampleQueries[i].addEventListener("click", search);
	}
}

function search(event)
{
	let input = document.getElementById("input");
	let h2 = document.getElementsByClassName("explanation subtitle")[0];

	if(event.target.getAttribute("class") == 'query')
	{
		let href = event.target.getAttribute("href");
		input.value = href.substring(1);
	}

	if(input.value.trim() == "")
	{
		//	Reset explanation subtitle and clear table data for empty input

		h2.innerHTML = "";

		removeData("thead");
		removeData("tbody");
	}
	else
	{
		const apiUrl = url +
				       `$where=lower(cca) LIKE lower('%${input.value}%')` +
					   '&$order=area_in_hectares DESC' +
					   '&$limit=100';
		const encodedURL = encodeURI(apiUrl);

		fetch(encodedURL)
			.then((result) =>
			{
				return result.json();
			})
			.then((data) =>
			{
				showResult(data, input, h2);
			});
	}

	event.preventDefault();
}

function showResult(parks, input, h2)
{
	//	Remove previous data

	removeData("thead");
	removeData("tbody");

	if(parks.length > 0)
	{
		h2.innerHTML =
			`The ${parks.length} largest Winnipeg parks in a community centre area name including '${input.value}'.`;

		let thead = document.getElementsByTagName("thead")[0];
		let tr = document.createElement("tr");
		let tbody = document.getElementsByTagName("tbody")[0];

		//	Handle table head

		for(let i = 0; i < columns_name.length; i++)
		{
			let th = document.createElement("th");
			th.innerHTML = columns_name[i];
			tr.appendChild(th);

			if(i == columns_name.length - 1)
			{
				thead.appendChild(tr);
			}
		}

		// Handle table body

		for(let i = 0; i < parks.length; i++)
		{
			let data = [parks[i].park_name, parks[i].location_description, parks[i].cca, parks[i].area_in_hectares];
			let	newTr = document.createElement("tr");

			for(let j = 0; j < data.length; j++)
			{
				let newTd = document.createElement("td");
				newTd.innerHTML = data[j];
				newTr.appendChild(newTd);
			}

			tbody.appendChild(newTr);
		}

		focusSelect(input);
	}
	else
	{
		h2.innerHTML =
			`Could not find any Winnipeg parks in a community centre area name including '${input.value}'.`;

		focusSelect(input);
	}
}

//	Function to set focus onto input for next search

function focusSelect(input)
{
	input.focus();
	input.select();
}

//	Function to remove table data

function removeData(table)
{
	let table_element = document.getElementsByTagName(table)[0];

	while(table_element.firstChild)
	{
		table_element.removeChild(table_element.firstChild);
	}
}