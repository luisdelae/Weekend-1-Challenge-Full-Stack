$(document).ready(function() {
	var costOfSalary = 0; //initiates cost of salary
	var values = {};

	$('#employeeForm').on('submit', function(event) {
		event.preventDefault();

		var empSalary = 0; //initiates salary of current employee

		$.each($('#employeeForm').serializeArray(), function(i, field) {
			console.log(field);
			values[field.name] = field.value;
		});

		empSalary = parseFloat(values.empAnualSalary); //gets the value of employee's salary

		$('#employeeForm').find('input[type=text]').val('');

		costOfSalary += empSalary; //caculates the cost of salary

		appendEmpInfo(values); //calls function to insert employee info to DOM
		updateCostOfEmpSalary(); //calls function to update total cost of salary

		console.log(costOfSalary); //just logs out the value, not actally needed
	});

	function updateCostOfEmpSalary() { //function to replace current total cost of salary with new total cost of salary
		$('#empCost').replaceWith('<p id=empCost>Total Monthly Cost of Salary: $' + costOfSalary/12 + '</p>');
	}


	function appendEmpInfo(empInfo) {
		$('#container').append('<div id=emp></div>'); //creates a div for the submitted employee info
		$('#container').append('<hr>')
		var $el = $('#container').children().last(); 

		$el.append('<p>First Name: ' + empInfo.empFirstName + '</p>'); //these next 5 lines add a <p> with employee info
		$el.append('<p>Last Name: ' + empInfo.empLastName + '</p>');
		$el.append('<p>ID Number: ' + empInfo.empIdNum + '</p>');
		$el.append('<p>Job Title: ' + empInfo.empJobTitle + '</p>');
		$el.append('<p id=sal>Annual Salary: ' + empInfo.empAnualSalary + '</p>');
		$el.append('<button id=delButton>Delete</button>'); //adds button to delete to each block of people
	}

	function delEmployee() {
		var $thisEmpSal = $(this).parent().find('#sal').text(); //gets the text value of the stuff contained in the element with id sal
		var currentEmpSalArray = $thisEmpSal.split(" "); //splits above into an array
		var currentEmpSalNum = parseFloat(currentEmpSalArray[2]); //gets the needed value from the array and converts it into a number
		costOfSalary-= currentEmpSalNum; //subtracts the salary to be deleted from the total cost of salary
		updateCostOfEmpSalary(); //calls the function to update total cost of salary
		$(this).parent().remove(); //removes the div with this employee
	}

	$('#container').on('click','#delButton', delEmployee); //event listener for the delete button
});


/* 
Next, have to work on making the total cost of salary only appear once. ****DONE!****
Hard mode is to create a delete button on each employee and delete them from the DOM. ****DONE!****
Pro mode is to do hard mode but have the cost of salary update after deleting employee fromm DOM. ****DONE!****
*/
