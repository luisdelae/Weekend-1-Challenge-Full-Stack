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

	$('#employeeList').append('<div id="' + empID + '" class="emp-div"><ul><li>Employee ID: ' + empID +
		'</li><li>First Name: ' + empFirstName + '</li><li>Last Name: ' + empLastName +
		'</li><li>Job Title: ' + empJobTitle + '</li><li>Salary: ' + empSalary + '</li>' +
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

				$('#employeeList').append('<div id="' + empID + '" class="emp-div"><ul><li>Employee ID: ' + empID +
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
	var thisSalaryString = $parentDiv.find('.salary').text();
	var thisSalaryParsed = thisSalaryString.split(' ');
	var thisSalaryNum = parseFloat(thisSalaryParsed[1]);

	console.log('this:: ' + $(this));
	console.log('parent:: '+ $parentDiv);
	console.log('salary string:: ' + thisSalaryString);
	console.log('salary parsed:: ' + thisSalaryParsed);
	console.log('salary num:: ', thisSalaryNum);

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


//when a new employee is added, it will not subtract, but still still add/remove the correct class.
//It is not seeing the parent of the button and thus is unable to get the value. Why?
//ask whether or not the app has to keep the active/inactive status through page reload.
//if so, will have to add status column to db, query db for status and go from there.