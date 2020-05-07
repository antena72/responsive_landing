<?php
//limpia posibles caracters malos
if($_POST) {
    //campos comunes
   $name = trim(stripslashes($_POST['nombre']));
   $apellido = trim(stripslashes($_POST['apellido']));
   $telefono = trim(stripslashes($_POST['telefono']));
   $email = trim(stripslashes($_POST['mail']));
    //consulta
   $contacto = $_POST['contacto'];
   $contact_message = trim(stripslashes($_POST['consulta']));
    //solicitud
    $ciudad = trim(stripslashes($_POST['ciudad']));
    $puesto = trim(stripslashes($_POST['puesto']));
    

   //Define e-mail al que se envia el formulario
   if($contacto == 'Donosti'){
    $siteOwnersEmail = 'amakalea@gmail.com, ximenamay@gmail.com';
   }else{
    $siteOwnersEmail = 'amakalea@gmail.com, ximenamay@hotmail.com';
   }

   // Arma mensaje para mail
   $message .= "Nombre: " . $name ."<br />";
   $message .= "Apellido: ". $apellido ."<br />";
   $message .= "Telefono de contacto: " . $telefono . "<br />";
    $message .= "Mail de contacto: " . $email . "<br />";
    if($contacto){
        $message .= "Ciudad: " . $contacto . "<br />";
    }
    if($contact_message){
        $message .= "Mensaje: <br />";
        $message .= $contact_message;
    }
    if($puesto){
        $message .= "Puesto: " . $puesto . "<br />";
    }
    if($ciudad){
        $message .= "Ciudad: " . $ciudad . "<br />";
    }
    
    if($contacto){
    $message .= "<br /> ----- <br /> Este mensaje fue enviado desde el formulario de Consultas de amakalea.com  ";
    }else{
        $message .= "<br /> ----- <br /> Este mensaje fue enviado desde el formulario de Solicitudes de amakalea.com  ";
    }

//Asunto del mensaje
$subject = 'Mensaje desde formulacio Consulta amakalea.com';

// Set From: header
$from =  $name . " <" . $email . ">";

$headers = "From: info@amakalea.com \r\n";
$headers .= "Reply-To:" . $email ."\r\n";
$headers .= "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";
$headers .= "Return-Path: amakalea@gmail.com" . "\r\n";
$headers .= "X-Mailer: PHP". phpversion() ."\r\n"; 

   if (!$error) {

      ini_set("sendmail_from", $siteOwnersEmail); //windows server
      $mail = mail($siteOwnersEmail, $subject, $message, $headers);

		if ($mail) { 
            echo "OK"; 
		}
      else { echo "Algo no salió bien."; }
		
	} # fin error

	else {

		$response = (isset($error['name'])) ? $error['name'] . "<br /> \n" : null;
		$response .= (isset($error['email'])) ? $error['email'] . "<br /> \n" : null;
		$response .= (isset($error['message'])) ? $error['message'] . "<br />" : null;
		
		echo $response;

	} # end if - there was a validation error

}

?>