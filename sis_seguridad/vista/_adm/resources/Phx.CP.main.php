<?php
/**
*@package pXP
*@file gen-TipoRequerimiento.php
*@author  (rortiz)
*@date 17-11-2011 16:29:57
*@description Archivo con la interfaz de usuario que permite la ejecucion de todas las funcionalidades del sistema
*/
session_start();
header("content-type: text/javascript; charset=UTF-8");

		$x=0;
	    if($_SESSION["encriptar_data"]=='si'){
	    	$x=1;
	    }
       //Devuelve la respuesta
      // echo '-->'.$_SESSION["_CONT_ALERTAS"]; exit;
       
       if($_GET["estado_sesion"]=='activa')
	   {
		        
		if(!isset($_SESSION["_CONT_ALERTAS"]) || $_SESSION["_CONT_ALERTAS"]==''){
		    $_SESSION["_CONT_ALERTAS"] = 0;
		} 
		
		if(!isset($_SESSION["_SIS_INTEGRACION"])){
                $sis_integracion = 'NO';
        }
        else{
              $sis_integracion = $_SESSION["_SIS_INTEGRACION"];
        }
        
		  
		echo "var _PARAMETROS={
			success:true,
		    m:'".$_SESSION['key_m']."',
			e:'".$_SESSION['key_e']."',
			k:'".$_SESSION['key_k']."',
			p:'".$_SESSION['_p']."',
			x:".$x.",
            parammetros:{cont_alertas:".$_SESSION["_CONT_ALERTAS"].",
            nombre_usuario:'".$_SESSION["_NOM_USUARIO"]."',
			mini_logo:'".$_SESSION["_MINI_LOGO"]."',
			nombre_basedatos:'".$_SESSION["_BASE_DATOS"]."',
			id_usuario:'".$_SESSION["_ID_USUARIO_OFUS"]."',
			id_funcionario:'".$_SESSION["_ID_FUNCIOANRIO_OFUS"]."',
			autentificacion:'".$_SESSION["_AUTENTIFICACION"]."',
			estilo_vista:'".$_SESSION["_ESTILO_VISTA"]."',
			mensaje_tec:'".$_SESSION["mensaje_tec"]."',
			sis_integracion:'".$sis_integracion."',
			timeout:".$_SESSION["_TIMEOUT"]."
            }};
			";
	   }
	   else{
	   	
		echo "var _PARAMETROS={success:true,
		    m:'".$_SESSION['key_m']."',
			e:'".$_SESSION['key_e']."',
			k:'".$_SESSION['key_k']."',
			p:'".$_SESSION['_p']."',
			x:".$x.",
			
           };
			";

	   }
?>
function main(){
	Phx.CP.iniciarLogin(<?php echo "'".$_GET["estado_sesion"]."',_PARAMETROS";?>);	
}
// al cargar el script ejecuta primero el metodo login
Ext.onReady(main,main,{single: true});
