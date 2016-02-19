var totalSalary;

$(document).ready(function() {
	$('body').on('load', appendEmpListOnLoad());
	$('#submit_emp').on('click', submitEmployee);
	$('#employeeList').on('click', 'button', toggleEmpActiveStatus);

});

var submitEmployee = function() {
	event.preventDefault();

	var values = {};
	$.each($('#employeeForm').serializeArray(), function(i, field) {
		values[field.name] = field.value;
	});

	$('#employeeForm').find('input[type=text]').val('');
	$.ajax({
		type: 'POST',
		url: '/emp_info',
		data: values,
		success: function (data) {
			console.log('From Server: ', data);
			appendEmpToDom(data);
		}
	})
}

var appendEmpToDom = function(empInformation) {
	var empID = empInformation.emp_id;
	var empFirstName = empInformation.emp_first_name;
	var empLastName = empInformation.emp_last_name;
	var empJobTitle = empInformation.emp_job_title;
	var empSalary = empInformation.emp_salary;

	$('#employeeList').append('<div id="' + empID + '" class="emp-div"><ul><li>Employee ID: ' + empID +
		'</li><li>First Name: ' + empFirstName + '</li><li>Last Name: ' + empLastName +
		'</li><li>Job Title: ' + empJobTitle + '</li><li>Salary: ' + empSalary + '</li>' +
		'<li><button>Deactivate</button></li></ul></div>');

	totalSalary += parseFloat(empSalary);

	$('#empCost').text('Total Monthly Cost of Salary: $' + totalSalary);
}

var appendEmpListOnLoad = function(empInformation) {
	totalSalary = 0;
	$.ajax({
		type: 'GET',
		url: '/emp_info',
		success: function(data) {

			data.forEach(function(empInformation, i) {
				var empID = empInformation.emp_id;
				var empFirstName = empInformation.emp_first_name;
				var empLastName = empInformation.emp_last_name;
				var empJobTitle = empInformation.emp_job_title;
				var empSalary = empInformation.emp_salary;

				$('#employeeList').append('<div id="' + empID + '" class="emp-div"><ul><li>Employee ID: ' + empID +
					'</li><li>First Name: ' + empFirstName + '</li><li>Last Name: ' + empLastName +
					'</li><li>Job Title: ' + empJobTitle + '</li><li class="salary">Salary: ' + empSalary + '</li>' +
					'<li><button>Deactivate</button></li></ul></div>');

				totalSalary += parseFloat(empSalary);

				$('#empCost').text('Total Monthly Cost of Salary: $' + totalSalary);
			})

		}
	})
}

var toggleEmpActiveStatus = function() {
	var $parentDiv = $(this).parent().parent().parent();
	var thisSalaryString = $parentDiv.find('.salary').text();
	var thisSalaryParsed = thisSalaryString.split(' ');
	var thisSalaryNum = parseFloat(thisSalaryParsed[1]);

	if ($(this).hasClass('inactive') == false) {
		$(this).addClass('inactive');
		$(this).text('Activate');
		$parentDiv.addClass('inactive');

		totalSalary -= thisSalaryNum;
		$('#empCost').text('Total Monthly Cost of Salary: $' + totalSalary);

	} else {
		$(this).removeClass('inactive');
		$(this).text('Deactivate');
		$parentDiv.removeClass('inactive');

		totalSalary += thisSalaryNum;
		$('#empCost').text('Total Monthly Cost of Salary: $' + totalSalary);
	}

	console.log("did something");

}

//	var costOfSalary = 0; //initiates cost of salary
//	var values = {};
//
//	$('#employeeForm').on('submit', function(event) {
//		event.preventDefault();
//
//		var empSalary = 0; //initiates salary of current employee
//
//		$.each($('#employeeForm').serializeArray(), function(i, field) {
//			console.log(field);
//			values[field.name] = field.value;
//		});
//
//		empSalary = parseFloat(values.empAnualSalary); //gets the value of employee's salary
//
//		$('#employeeForm').find('input[type=text]').val('');
//
//		costOfSalary += empSalary; //caculates the cost of salary
//
//		appendEmpInfo(values); //calls function to insert employee info to DOM
//		updateCostOfEmpSalary(); //calls function to update total cost of salary
//
//		console.log(costOfSalary); //just logs out the value, not actally needed
//	});
//
//	function updateCostOfEmpSalary() { //function to replace current total cost of salary with new total cost of salary
//		$('#empCost').replaceWith('<p id=empCost>Total Monthly Cost of Salary: $' + costOfSalary/12 + '</p>');
//	}
//
//
//	function appendEmpInfo(empInfo) {
//		$('#container').append('<div id=emp></div>'); //creates a div for the submitted employee info
//		$('#container').append('<hr>')
//		var $el = $('#container').children().last();
//
//		$el.append('<p>First Name: ' + empInfo.empFirstName + '</p>'); //these next 5 lines add a <p> with employee info
//		$el.append('<p>Last Name: ' + empInfo.empLastName + '</p>');
//		$el.append('<p>ID Number: ' + empInfo.empIdNum + '</p>');
//		$el.append('<p>Job Title: ' + empInfo.empJobTitle + '</p>');
//		$el.append('<p id=sal>Annual Salary: ' + empInfo.empAnualSalary + '</p>');
//		$el.append('<button id=delButton>Delete</button>'); //adds button to delete to each block of people
//	}
//
//	function delEmployee() {
//		var $thisEmpSal = $(this).parent().find('#sal').text(); //gets the text value of the stuff contained in the element with id sal
//		var currentEmpSalArray = $thisEmpSal.split(" "); //splits above into an array
//		var currentEmpSalNum = parseFloat(currentEmpSalArray[2]); //gets the needed value from the array and converts it into a number
//		costOfSalary-= currentEmpSalNum; //subtracts the salary to be deleted from the total cost of salary
//		updateCostOfEmpSalary(); //calls the function to update total cost of salary
//		$(this).parent().remove(); //removes the div with this employee
//	}
//
//	$('#container').on('click','#delButton', delEmployee); //event listener for the delete button
//});
//
//
///*
//Next, have to work on making the total cost of salary only appear once. ****DONE!****
//Hard mode is to create a delete button on each employee and delete them from the DOM. ****DONE!****
//Pro mode is to do hard mode but have the cost of salary update after deleting employee fromm DOM. ****DONE!****
//*/
