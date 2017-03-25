const URL_BASE = "http://crossknowledge.api/";
var pessoas = [];

$(document).ready(function () {
	$("#cep").mask("99999-999");
	$("#data_nascimento").mask("99/99/9999");
	populateTable();
});

$("#formModalDados").submit(function (e) {
	e.preventDefault();
	data = $(this).clone();
	data.find("#data_nascimento").val(normalizaData(data.find("#data_nascimento").val(), true));

	if ($("#id").val() > 0) {
		$.ajax({
		  type: "PUT",
		  url: URL_BASE + "dados",
		  data: data.serialize(),
		  success: function(response) {
		  	$("#id").val("");
		  	$("#formModalDados").trigger("reset");
		  	hideModal("#modalDados", function () {
			  	successModal("Registro alterado com sucesso!");
		  	});
		  	populateTable();
		  }
		});
	} else {
		$.ajax({
		  type: "POST",
		  url: URL_BASE + "dados",
		  data: data.serialize(),
		  success: function(response) {
		  	$("#id").val("");
		  	$("#formModalDados").trigger("reset");
		  	hideModal("#modalDados", function () {
			  	successModal("Registro adicionado com sucesso!");
		  	});
		  	populateTable();
		  }
		});
	}
});

$("#cancelarDados").on("click", function () {
	$("#id").val("");
	$("#formModalDados").trigger("reset");
	hideModal("#modalDados");
});

$("#btAdicionar").on("click", function () {
	$("#id").val("");
	$("#formModalDados").trigger("reset");
	showModal("#modalDados");
});

function deletar (i) {
	confirmModal("Deseja realmente deletar o registro de " + pessoas[i].nome + "?", function () {
		$.ajax({
		  type: "DELETE",
		  url: URL_BASE + "dados/"+pessoas[i].id,
		  success: function(response) {
		  	successModal("Registro deletado com sucesso!");
		  	populateTable();
		  }
		});
	});
}

function editar (i) {
	$("#id").val(pessoas[i].id);
	$("#nome").val(pessoas[i].nome);
	$("#sobrenome").val(pessoas[i].sobrenome);
	$("#data_nascimento").val(normalizaData(pessoas[i].dataNascimento));
	$("#rua").val(pessoas[i].endereco.rua);
	$("#numero").val(pessoas[i].endereco.numero);
	$("#complemento").val(pessoas[i].endereco.complemento);
	$("#cep").val(pessoas[i].endereco.cep);

	showModal("#modalDados");
}

function confirmModal(texto, callback = function () {}) {
	$("body").append('<div id="modalConfirm" class="modal confirm"><span>'+texto+'</span><div class="botoes"><button id="btCancelarConfirm" class="bt cancelar">Cancelar</button> <button id="btConfirm" class="bt delete">Deletar</button></div></div>');
	showModal("#modalConfirm");

	$("#btConfirm").on("click", function () {
		hideModal("#modalConfirm", function () {
			$("#modalConfirm").remove();	
			callback();
		});
	});

	$("#btCancelarConfirm").on("click", function () {
		hideModal("#modalConfirm", function () {
			$("#modalConfirm").remove();	
		});
	});
	
}

function successModal(texto) {
	$("body").append('<div id="modalSuccess" class="modal success"><span>'+texto+'</span><button id="btOk" class="bt adicionar">Ok</button></div>');
	showModal("#modalSuccess");

	$("#btOk").on("click", function () {
		hideModal("#modalSuccess", function () {
			$("#modalSuccess").remove();	
		});
	});
	
}

function showModal(modal) {
	$(".black_layer").remove();
	$("body").append('<div class="black_layer"></div>');
	$("body").css("overflow", "hidden");

	$(modal).show("slow");
}

function hideModal(modal, callback = function () {}) {
	$(modal).hide("slow", function () {
		$(".black_layer").remove();
		callback();
	});
	$("body").css("overflow", "auto");
}

function populateTable() {
	$.ajax({
	  type: "GET",
	  url: URL_BASE + "pessoas",
	  success: function(response) {
	  	responseObj = JSON.parse(response);
	  	pessoas = responseObj.data;

	  	$('#tbody').empty();
	  	for (var i = 0; i < pessoas.length; i++) {
	  		var tr_var ='<tr>';
	  		tr_var += '<td class="td_int">' + (i+1) + '</td>';
	  		tr_var += '<td class="td_str">' + pessoas[i].nome +' '+ pessoas[i].sobrenome + '</td>';
	  		tr_var += '<td class="td_int">' + normalizaData(pessoas[i].dataNascimento) + '</td>';
	  		tr_var += '<td class="td_str">' + pessoas[i].endereco.rua +', nº '+ pessoas[i].endereco.numero + ' ' + pessoas[i].endereco.complemento + '</td>';
	  		tr_var += '<td class="td_botoes"><button type="button" class="bt delete" onclick="deletar('+i+')">Deletar</button> <button type="button" class="bt edit" onclick="editar('+i+')">Editar</button></td>';	
	  		tr_var += '</tr>';

	  		$(tr_var).appendTo('#tbody');
	  	}

	  	$("#qtdeRegistros").html(pessoas.length + " registros encontrados.");
	  }
	});

	
}

function normalizaData(data, toBanco) {
	if (toBanco) {
		dataInvertida = data.split("/").reverse().join("-");
	} else {
		dataInvertida = data.split("-").reverse().join("/");
	}

	return dataInvertida;
}