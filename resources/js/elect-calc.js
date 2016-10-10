ElectCalc = function(teachers){
	this.teachers = parseInt(teachers);

	this.maxWorkers = Math.floor(teachers*0.1/0.75);
	this.minStudents = Math.ceil(teachers*0.2);
};

$(document).ready(function(){
	$('#elect_calc, .elect-calc').click(function(){
		var calc = new ElectCalc($('[name="elect_teacher"]').val());

		$('#quota-teachers').text(calc.teachers);
		$('#quota-workers').text(calc.maxWorkers);
		$('#quota-students').text(calc.minStudents);
		$('#quota-total').text(calc.teachers + calc.maxWorkers + calc.minStudents);
		$('.elect-quotas-wrap').slideDown();
	});
});