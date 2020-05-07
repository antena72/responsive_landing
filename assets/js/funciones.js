
    $(document).ready(function () {

    //inicio
    smoothScroll();

    //si la pantalla es para ipads o escritorio, esconde referencias

    $('#formulario2').hide();
    $('#respuestaFormConsulta div').hide();
    $('#respuestaFormSolicitud div').hide();
    let primero = 0;
    let cuarto = 4;
    
    //Formulario de solicitud
    $('#formSolicitud').submit(function(e){
        e.preventDefault();
        console.log('Formulario consulta enviado');
        //activa spiner mientras se procesa el fomulario
        $('#respuestaFormSolicitud #message-wait-solicitud').css('display', 'initial').html('<i class="txtVerde fas fa-3x fa-circle-notch fa-spin"></i>');
    
        //toma valor de campos
        let nombre = $('#formSolicitud input[name=nombre]').val();
        let apellido = $('#formSolicitud input[name=apellido]').val();
        let telefono = $('#formSolicitud input[name=telefono]').val();
        let mail = $('#formSolicitud input[name=mail]').val();
        let ciudad = $('#formSolicitud input[name=ciudad]').val();
        let puesto = $('#formSolicitud input[name=puesto]').val();
        let data;
        console.log(nombre+apellido+telefono);
        //ajax
        $.ajax({
            type: "POST",
            url: "sendMail.php",
            data:{nombre: nombre, apellido: apellido, telefono: telefono, mail: mail, ciudad: ciudad, puesto: puesto},
            beforeSend:function(){
            // console.log(data);
            },
    
            success: function(msg) {
                console.log(msg);
                // Message was sent
                if (msg == 'OK') {
                $('#message-wait-solicitud').fadeOut();
                $('#message-warning-solicitud').hide();
                $('#formSolicitud').fadeOut();
                $('#message-success-solicitud').fadeIn();
                }
                // There was an error
                else {
                $('#message-wait-solicitud').fadeOut();
                $('#message-warning-solicitud').html(msg);
                $('#message-warning-solicitud').fadeIn();
                }
    
            },//fin success
            error: function(){
            //alert("Error");
            }
            });//fin ajax
            return false;
    
    });
    $('#botFormulario, #botFormularioSolicitud').click(function(e){
        e.preventDefault();
        $('#botFormularioSolicitud i').toggleClass('fa-plus fa-times');
        $('#formulario2').toggle('slow');
    });
    
    
    //Novedades
    //variables
    let novedades = '';
    let masInfo = '';
    const date = new Date();
    let desde = new Date(date.getFullYear(), date.getMonth(), 1);
    let hasta = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //console.log('Desde: '+desde+'-'+hasta);
    let resultadoFiltrado;
    
    //EVENTOS
    //muestra info aficional
    $(document).on("click",".crsl-item", function(){
        let id = $(this).attr('id');
        //esconde todas las estuvieran abiertas
        $('.masInfo').css('display', 'none');
        //muestra info
        $('#info_'+id).show('slow');
    });
    $(document).on("click",".crsl-item a", function(e){
        e.preventDefault();
    })
    $(document).on("click","#cierre", function(){
        $(this).parent().hide('slow');
    })
    $(document).on("click",".crsl-nav .previous", function(e){
        e.preventDefault();
        console.log('prev');
        $('#foo').animate({'right' : '30px'});                
    })
    
    //pedido ajax
    $.ajax({
        url : 'assets/js/novedades.json',
        type : 'GET',
        dataType : 'json',
        success : function(data) {
        //ordena por mes vigente
        ordenaNovedades(data)
        console.log(data);
        //data.sort(custom_sort);
        $.each(resultadoFiltrado, function (key, val) {
            //console.log('Base '+val.fecha);
            let fecha_json = new Date(val.fecha);
            fecha_json.setDate(fecha_json.getDate() + 1);
            //console.log('Convertida '+fecha_json)
            novedades += '<div id="item_'+val.id+'" class="crsl-item';
            //si es del mes corriente, agrega clase
            if(fecha_json >= desde && fecha_json <= hasta){
                //console.log('Dia del mes');
                novedades += ' mes-activo ';                
            }
            novedades += '"><div><img src="assets/img/news/'+val.imagenNoticia+'" width="100%" alt=""><h3>'+ val.tituloNoticia +'</h3><p>'+ val.fecha +' '+ val.textoNoticia +'</p><a class="txtVerde txtNegrita" href="'+ val.i+'">READ MORE</a></div>\n';
            //mas info
            masInfo += '<div class="masInfo" id="info_item_'+ val.id +'"><i id="cierre" class="txtBlanco fas fa-times"></i><div><h3 class="txtBlanco">'+val.tituloNoticia+'</h3><h3 class="txtVerde">'+val.textoNoticia+'</h3><p class="txtBlanco">'+val.cuerpoNoticia+'</p><p class="txt11 txtVerde">'+val.palabrasNoticia+'</p></div></div>';
        });
        //modifica el DOM
        $('.crsl-wrap').append(novedades);
        $('#masInfo').append(masInfo)
        },
        error : function(xhr, status, error) {
            //alert('Disculpe, existió un problema Status: '+ status + ' error:+ error);
        },
        // código a ejecutar sin importar si la petición falló o no
        complete : function(xhr, status) {
            //console.log('Petición realizada');
            //activa carrousel
            $('.crsl-items').carousel({ visible: 4, itemMinWidth: 200, itemMargin: 10 })
        }
    })
    
    //FUNCIONES
    //ordena por fecha cronológica
    function ordenaNovedades(data){
        let futureDates = data.filter(x => new Date(x.fecha) >= desde);
        let pastDates = data.filter(x => new Date(x.fecha) < desde);
        //ordena los regisros por dia
        futureDates.sort(custom_sort);
        pastDates.sort(custom_sort);
    
        let ultimo =  pastDates.slice(-1)[0];//guarda el ultimo registro
        //console.log(ultimo);
        pastDates.pop();//borra al ultimo para que no se duplique
        futureDates.unshift(ultimo); //agrega al principio
        resultadoFiltrado = futureDates.concat(pastDates);//nueva cadena con todo
    }
    
    function custom_sort(a, b) { 
        let fecha_a = new Date(a.fecha);
        //corrige distorcion de fechas
        fecha_a.setDate(fecha_a.getDate() + 1);
    
        let fecha_b = new Date(b.fecha);
        fecha_b.setDate(fecha_b.getDate() + 1);
    
        return fecha_a - fecha_b;
        //return new Date(a.fecha).getDate() - new Date(b.fecha).getDate();   
    }
    
    //Formulario de Consulta
    $('#formConsulta').submit(function(e){
        e.preventDefault();
        console.log('Formulario consulta enviado');
        //activa spiner mientras se procesa el fomulario
        $('#respuestaFormConsulta #message-wait').css('display', 'initial').html('<i class="fas fa-3x fa-circle-notch fa-spin"></i>');
    
        //toma valor de campos
        let nombre = $('input[name=nombre]').val();
        let apellido = $('input[name=apellido]').val();
        let telefono = $('input[name=telefono]').val();
        let mail = $('input[name=mail]').val();
        let contacto = $('select[name=contacto]').val();
        let consulta = $('textarea[name=consulta]').val();
        let data;
        //ajax
        $.ajax({
            type: "POST",
            url: "sendMail.php",
            data:{nombre: nombre, apellido: apellido, telefono: telefono, mail: mail, contacto: contacto, consulta: consulta},
            beforeSend:function(){
            console.log(data);
            },
    
            success: function(msg) {
                console.log(msg);
                // Message was sent
                if (msg == 'OK') {
                $('#message-wait').fadeOut();
                $('#message-warning').hide();
                $('#formConsulta').fadeOut();
                $('#message-success').fadeIn();
                }
                // There was an error
                else {
                $('#message-wait').fadeOut();
                $('#message-warning').html(msg);
                $('#message-warning').fadeIn();
                }
    
            },//fin success
            error: function(){
            //alert("Error");
            }
            });//fin ajax
            return false;
    
    });

    
    
    //responsive
    $('.mobile-toggle').click(function() {
        if ($('.main_h').hasClass('open-nav')) {
            $('.main_h').removeClass('open-nav');
        } else {
            $('.main_h').addClass('open-nav');
        }
    });
    $('.main_h li a').click(function() {
        if ($('.main_h').hasClass('open-nav')) {
            $('.navigation').removeClass('open-nav');
            $('.main_h').removeClass('open-nav');
        }
    });
    
    //scroll
    function smoothScroll() {
        $('nav a').click(function(event) {
        let id = $(this).attr("href");
        let offset = 70;
        let target = $(id).offset().top - offset;
        $('html, body').animate({
            scrollTop: target}, 500);
        event.preventDefault();
        })
    }
         
    //linea de tiempo
    $('#example').horizontalTimeline({
    desktopDateIntervals: 200,
    tabletDateIntervals: 150,
    mobileDateIntervals: 120,
    minimalFirstDateInterval: true,
    
    dateDisplay: "year", // dateTime, date, time, dayMonth, monthYear, year
    dateOrder: "normal", // normal, reverse
    
    autoplay: false,
    autoplaySpeed: 8,
    autoplayPause_onHover: false,
    
    useScrollWheel: false,
    useTouchSwipe: true,
    useKeyboardKeys: false,
    addRequiredFile: true,
    useFontAwesomeIcons: true,
    useNavBtns: true,
    useScrollBtns: true,
    
    iconBaseClass: "fas fa-2x", // Space separated class names
    scrollLeft_iconClass: "fa-chevron-circle-left",
    scrollRight_iconClass: "fa-chevron-circle-right",
    prev_iconClass: "fa-arrow-circle-left",
    next_iconClass: "fa-arrow-circle-right",
    pause_iconClass: "fa-pause-circle",
    play_iconClass: "fa-play-circle",
    
    animation_baseClass: "animationSpeed" // Space separated class names
    
    });
    //contador numeros
    $( "#btnHistoria" ).click(function() {           
                console.log('count');
                $('.count').each(function () {
                var $this = $(this);
                    jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
                        duration: 4000,
                        easing: 'swing',
                        step: function () {
                            $this.text(Math.ceil(this.Counter)).delay(1000);
                        }
                    });
                })
            });
    
    // muestra y oculta texto de inicio
    $("#franja #botonDetalle").click(function(e) {
        e.preventDefault();
        $("#presentacion").toggle( "slow" );
        $('#franja #botonDetalle i').toggleClass('fa-plus fa-times');
    });
    
    
    })
  