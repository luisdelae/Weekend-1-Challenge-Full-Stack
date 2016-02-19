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

	values.emp_activity_status = true;

	$('#employeeForm').find('input[type=text]').val('');
	$('#employeeForm').find('input[type=number]').val('');

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

	$('#employeeList').append('<div id="' + empID + '" class="emp-div"><ul><li class="empID">Employee ID: ' + empID +
		'</li><li>First Name: ' + empFirstName + '</li><li>Last Name: ' + empLastName +
		'</li><li>Job Title: ' + empJobTitle + '</li><li class="salary">Salary: ' + empSalary + '</li>' +
		'<li><button class="activeButton">Deactivate</button></li></ul></div>');

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
				var empActivityStatus = empInformation.emp_activity_status;

				console.log(empActivityStatus);

				$('#employeeList').append('<div id="' + empID + '" class="emp-div"><ul><li class="empID">Employee ID: ' + empID +
					'</li><li>First Name: ' + empFirstName + '</li><li>Last Name: ' + empLastName +
					'</li><li>Job Title: ' + empJobTitle + '</li><li class="salary">Salary: ' + empSalary + '</li>' +
					'<li><button class="activeButton">Deactivate</button></li></ul></div>');

				totalSalary += parseFloat(empSalary);

				$('#empCost').text('Total Monthly Cost of Salary: $' + totalSalary);
			})

		}
	})
}

var toggleEmpActiveStatus = function() {
	var $parentDiv = $(this).parent().parent().parent();
	var thisEmpIDString = $parentDiv.find('.empID').text();
	var thisEmpIDParsed = thisEmpIDString.split(' ');
	var thisEmpID = thisEmpIDParsed[2];
	var thisSalaryString = $parentDiv.find('.salary').text();
	var thisSalaryParsed = thisSalaryString.split(' ');
	var thisSalaryNum = parseFloat(thisSalaryParsed[1]);

	var testObj = {emp_id: parseInt(thisEmpID)};

	if ($(this).hasClass('inactive') == false) {

		//check what class the button has assigned to it.
		//if it has active class, then send post request to server/DB to change the status to
		//inactive once the button is pressed, then do all the other stuff.

		$.ajax({
			type: 'POST',
			url: '/status_change',
			data: testObj,
			success: function() {
				console.log("status change request success");
			}
		})
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

//Need to make the class of the div update on load as well depending on activity status returned by server.