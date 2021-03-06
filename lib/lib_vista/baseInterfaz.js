/*
**********************************************************
Nombre de la clase:	    Paginaa   
Proposito:				clase abtracta  generica de interfaz 
Fecha de Creacion:		17 - 09 - 11
Version: 				0 
Autor:					Rensi Arteaga Copari
**********************************************************
*/
Ext.namespace('Phx', 'Phx.vista');
Phx.baseInterfaz = Ext.extend(Ext.util.Observable, {

    //Phx.baseInterfaz=function(){
    //return{
    // Componentes:NULL,
    title: 'base-Interfaz',
    timeout: Phx.CP.config_ini.timeout,

    conexionFailure: Phx.CP.conexionFailure,
    ActDel: '',
    winmodal:true,
    bsave: false,
    bnew: true,
    bedit: true,
    bdel: true,
    bact: true,
    btest:true,
    bexcel: false,
    tipoInterfaz: 'baseInterfaz',
    egrid: false,
    fheight:'50%',
    fwidth: '50%',
    reload: true,
    // <-- habilita la reutilizacion de la interfaz
    argumentSave: {},
    fileUpload: false,
    // configura regiones
    south: false,
    west: false,
    east: false,

    /*para limpiar */
    configForm: {
        height: 340,
        width: 480,
        minWidth: 150,
        minHeight: 200,
        closable: true,
        titulo: 'Formulario'
    },
    tabEnter:false,//habilitar el uso de enter para recorreer el formulario

    /*esta funcion se sobrecarga en el hijo
	 * aqui se colocan el codigo necesario para establecer el manejo de eventos 
	 * del formulario. Corre al iniciar la pagina
	 * */
    iniciarEventos: function() {
},
   
 /**
 * @function addButton
 * @autor Rensi Arteaga Copari
 * Add button in top tollbar
 * @param {varchar} id  clave para reconocer el boton
 * @param {Object} param Objeto con la configuracion comun para un boton Ext.button
 */
    addButton: function(id, param) {

        var bconf = {
            icon: '../../../lib/imagenes/a_xp.png',
            //cls: 'x-btn-icon',
            disabled: true,
            scope: this
        };
        Ext.apply(bconf, param);
        bconf.id = 'b-' + id + '-' + this.idContenedor;

        this.tbar.addButton(bconf)
        },

    getBoton: function(id) {
         // retorna el boton solicitado
         var b = this.tbar.items.get('b-' + id + '-' + this.idContenedor);
         
         if(b){
         	return b
         }
         else{
         	
         	c =  this.tbar.findByType('splitbutton');
         	for (var i = 0; i < c.length; i++) {
         		b = c[i].menu.items.get('b-' + id + '-' + this.idContenedor);
         		if(b){
         			return b
         		}
         	}
         	
         	
         }
         

        },

    // Funcion nuevo del toolbar
    onButtonNew: function() {
        this.window.buttons[0].show();
        this.form.getForm().reset();
        this.loadValoresIniciales();
        this.window.show();
        if(this.getValidComponente(0)){
        	this.getValidComponente(0).focus(false,100);
        }
        
    },
    // Funcion editar del toolbar
    onButtonEdit: function() {
        this.window.show();
        this.loadForm(this.sm.getSelected())
        this.window.buttons[0].hide();
         
    },

    onButtonSave: function() {
    },

    onButtonTest:function(){
 	    console.log('sobre cargar pruebas');
 	    
 	  
 	
    },

    onDeclinar: function() {
        this.window.hide()
        },

    // Funcion guardar del formulario
    onSubmit: function(o) {
        if (this.form.getForm().isValid()) {

            Phx.CP.loadingShow();
            // arma json en cadena para enviar al servidor
            Ext.apply(this.argumentSave, o.argument);

            //console.log(this.argumentSave,o.argument)
            if (this.fileUpload) {

                Ext.Ajax.request({
                    form: this.form.getForm().getEl(),
                    url: this.ActSave,
                    params: this.getValForm,
                    headers: {
				        'Accept': 'application/json',
				    },
				    isUpload: this.fileUpload,
                    success: this.successSaveFileUpload,
                    argument: this.argumentSave,
                    failure: function(r) {
                        console.log('falla upload', r)
                        },
                    timeout: this.timeout,
                    scope: this
                })

                } else {
                Ext.Ajax.request({
                    url: this.ActSave,
                    //params:this.form.getForm().getValues(),
                    params: this.getValForm,
                    isUpload: this.fileUpload,
                    success: this.successSave,
                    argument: this.argumentSave,

                    failure: this.conexionFailure,
                    timeout: this.timeout,
                    scope: this
                });
            }

        }

    },
    // recorre todos los atributos y los setea los valores en el formulario
    loadForm: function(rec) {
        for (var i = 0; i < this.Componentes.length; i++) {
            if (this.Componentes[i]) {
                if ((this.Atributos[i].type == 'ComboBox' && this.Atributos[i].config.mode == 'remote') || this.Atributos[i].type == 'TrigguerCombo' || this.Atributos[i].type == 'ComboRec') {
                    var _id = this.Componentes[i].valueField;
                    /*25nov11
					adicion variable _id_name: para mapear el valor del store origen que no necesariamente tiene el mismo nombre que el value_field
					*/
                    var _id_name = this.Componentes[i].name;
                    if (rec.data[_id_name] != undefined && rec.data[_id_name] != null && rec.data[_id_name] != 'null') {
                        //nombre del atributo del combo que recibe el valor
                        var _dis = this.Componentes[i].displayField;

                        //define el origen del displayField en el grid
                        var _df = this.Componentes[i].displayField;

                        if (this.Atributos[i].config.gdisplayField) {

                            _df = this.Atributos[i].config.gdisplayField;
                        }

                        if (!this.Componentes[i].store.getById(rec.data[_id_name])) {
                            var recTem = new Array();
                            recTem[_id] = rec.data[_id_name];
                            recTem[_dis] = rec.data[_df];

                            this.Componentes[i].store.add(new Ext.data.Record(recTem, rec.data[_id_name]));

                            this.Componentes[i].store.commitChanges();
                        }
                    }
                    this.Componentes[i].setValue(rec.data[_id_name])
                    } else {

                    if (this.Componentes[i].inputType == 'file') {
                        //console.log('file')
                        } else {
                        this.Componentes[i].setValue(rec.data[this.Componentes[i].mapeo ? this.Componentes[i].mapeo: this.Componentes[i].name])

                        }
                }

            }

        }

    },
    //llena los valores que fueron definidos por edefecto
    loadValoresIniciales: function() {
        for (var i = 0; i < this.Componentes.length; i++) {
            if (this.Atributos[i].valorInicial != undefined) {
                this.Componentes[i].setValue(this.Atributos[i].valorInicial)
                }
        } 
        
   },
    
    
  
    agregarArgsExtraSubmit: function() {
},

    agregarArgsBaseSubmit: function() {
},

    //obtiene los valores de los componentes del formulario y los pones en un array
    //de esta forma se logra que los campos  deshabilitados regresen valores 
    getValForm: function() {
        var resp = {};

        for (var i = 0; i < this.Componentes.length; i++) {
            var ac = this.Atributos[i];
            var cmp = this.Componentes[i]
            //if(ac.form!=false && !this.Componentes[i].disabled){ 
            var swc = true;
            if (ac.vista) {
                swc = false;
                for (var _p in ac.vista) {
                    if (this.nombreVista == ac.vista[_p]) {
                        swc = true;
                        break;
                    }
                }
            }

            if (ac.form != false && swc) {
                //   console.log(ac.config.name,this.Componentes[i].getValue())
                //rac 12/09/2011
                var _name = ac.config.name;
                if (cmp.getValue() != '' && ac.type == 'DateField' && ac.config.format) {
                    resp[_name] = cmp.getValue().dateFormat(ac.config.format)
                    } 
              else {
              	    //si es combo 
              	    
              	    if(ac.type == 'ComboBox' && ac.config.rawValueField){
              	    	//console.log(cmp.getRawValue())
              	    	
              	    	resp[_name] =cmp.getValue();
              	    	
              	    	if ( cmp.getRawValue()==resp[_name] ){
              	    		resp[ac.config.rawValueField] = cmp.getRawValue();
              	    		resp[_name]=null;
              	    	}
              	    	
              	    	
              	    	
              	    }
              	    else{
              	    	//rac 29/10/2011  codificacion de ampersand para su almacenamiento en base de datos
                        resp[_name] = cmp.getValue();
              	    }
              	

                    
                    //console.log('valores',cmp.getValue())
                    resp[_name] = String(resp[_name]).replace(/&/g, "%26");
                }
            }
        }

        //RCM 12/12/2011: Llamada a funciГіn para agregar parametros
        this.agregarArgsExtraSubmit();
        this.agregarArgsBaseSubmit();
        Ext.apply(resp, this.argumentExtraSubmit);
        Ext.apply(resp, this.argumentBaseSubmit);

        //FIN RCM
        return resp
    },
    //RAC 21092011
    //funcion especifica para procesa el resultado de upload file
    successSaveFileUpload: function(resp, a, b, c, d) {
    	resp.responseText =resp.responseText.replace('<pre>','').replace('</pre>','')
    	var reg = Ext.util.JSON.decode(Ext.util.Format.trim(resp.responseText));
        if (reg.ROOT.error) {
            resp.status = 406;
            this.conexionFailure(resp)
            } else {
            this.successSave(resp);
        }
    },

    successSave: function(resp) {
        console.log('sobre cargar successSave')
        },
    getComponente: function(id) {

        return this.form.getForm().findField(id);

    },
    getIndAtributo: function(name) {
        for (var m in this.Atributos) {
            if (this.Atributos[m].config.name == name) {
                return m
            }
        }
        return undefined;
    },

    onDestroy: function() {
        //Phx.baseInterfaz.superclass.destroy.call(this,c);
        if (this.window) {
            this.window.destroy();
        }
        if (this.form) {
            this.form.destroy();
        }

        Phx.CP.destroyPage(this.idContenedor);
        delete this;

    },
    onHide: function() {
},
    onShow: function() {
},
    init: function() {
        // inicializacion de variables
        this.panel.doLayout();
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'under';
        // muestra mensajes de error
        // en el formulario
        //si son ventanas hijo preguntar si el padre tiene un registro seleccionado para hacer reload
        //util en el caso de hijos en tappanel
       // this.fireEvent( 'init', {interface: this} );
        
        },
    getForm: function() {
        return this.form;
    },

    /*EJEMPLO GRUPO
		 * 
		 * 
		  Grupos: [
            {
                layout: 'column',
                border: false,
                defaults: {
                   border: false
                },            
                items: [{
					        bodyStyle: 'padding-right:5px;',
					        items: [{
					            xtype: 'fieldset',
					            title: 'Datos principales',
					            autoHeight: true,
					            items: [],
						        id_grupo:0
					        }]
					    }, {
					        bodyStyle: 'padding-left:5px;',
					        items: [{
					            xtype: 'fieldset',
					            title: 'Orden y rutas',
					            autoHeight: true,
					            items: [],
						        id_grupo:1
					        }]
					    }]
            }
        ]
		*******/

    pushGrupo: function(c, g, id) {
        var pag = this;
        if (id) {
            if (!pag.buscarGrupo(g, id, c)) {
                pag.buscarGrupo(g, 0, c)
                // .items.push(c)
                }
        } else {
            pag.buscarGrupo(g, 0, c)
            // .items.push(c)
            }
    },

    buscarGrupo: function(g, id, c) {
        // preguntamos si estamos en el grupo que buscamos
        var j = 0,
        pag = this;;
        while (j < g.length) {
            if (g[j].id_grupo == id) {            	
                g[j].items.push(c);
                return true
            } else {
                // si no buscamos el grupo en nuestros items hijos
                if (g[j].items && g[j].items.length > 0) {
                    // alert("SI tiene items")
                    if (pag.buscarGrupo(g[j].items, id, c)) {
                        // se encontro el items
                        return true;
                    }
                }
            }
            j++
        }
        return false;
    },

    setMetodoGrupo: function(idGrupo, Metodo, param) {
        eval('this.form.find(\'id_grupo\',idGrupo)[0].' + Metodo + '(param)');
    },
    
 /**
 * @function ocultarComponente
 * @autor Rensi Arteaga Copari
 * Oculta un field o componente del formulario
 * @param {Ext.Field} componente  
 * 
 */
    ocultarComponente: function(componente) {
    	componente.ant_disabled=(componente.ant_disabled!=undefined)?componente.ant_disabled:componente.disabled;
    	//componente.reset();
        componente.disable();
        componente.hide();

    },
 /**
 * @function mostrarComponente
 * @autor Rensi Arteaga Copari
 * mostrar componente o field  en el formulario
 * @param {Ext.Field} componente  
 * 
 */
    mostrarComponente: function(componente) {
    	componente.ant_disabled=(componente.ant_disabled!=undefined)?componente.ant_disabled:componente.disabled;
    	if (componente.ant_disabled==false) {
            componente.enable();
        }
        componente.show();
    },
    
  /**
 * @function adminGrupo
 * @autor Rensi Arteaga Copari
 * mostrar o oculta los componetne de un grupo
 * mas eficiente que utilizar mostrarComponente o ocultarComponente
 * @param {Object} con  configuracion ejm. {mostras:[1,2,],ocultar:[3]}  
 * 
 */   
    adminGrupo: function(con) {
        for (var i = 0; i < this.Atributos.length; i++) {
            //mostrar grupo
            if (con.mostrar) {

                for (var j = 0; j < con.mostrar.length; j++) {
                    if (this.Componentes[i] && this.Atributos[i].id_grupo == con.mostrar[j]) {
                        this.mostrarComponente(this.Componentes[i]);
                        //console.log('numero',con.mostrar[j])
                        this.form.find('id_grupo', con.mostrar[j])[0].show();
                    }
                }
            }

            //ocultamos grupos
            if (con.ocultar) {
                for (var j = 0; j < con.ocultar.length; j++) {
                    if (this.Componentes[i] && this.Atributos[i].id_grupo == con.ocultar[j]) {
                        this.ocultarComponente(this.Componentes[i]);
                        this.form.find('id_grupo', con.ocultar[j])[0].hide();

                    }
                }
            }
        }
        },
        
 /**
 * @function ocultarComponente
 * @autor Rensi Arteaga Copari
 * oculta todos los componente del grupo indicado
 * @param {Ext.integer} idGrupo  
 * 
 */
    ocultarGrupo: function(idGrupo) {
        //this.form.find('id_grupo',idGrupo)[0].disable()
        for (var i = 0; i < this.Atributos.length; i++) {
            if (this.Componentes[i] && this.Atributos[i].id_grupo == idGrupo) {
                this.ocultarComponente(this.Componentes[i]);
            }
        }

        this.form.find('id_grupo', idGrupo)[0].hide();
    },
    
 /**
 * @function mostrarGrupo
 * @autor Rensi Arteaga Copari
 * muestra todos los componentes de un grupo
 * @param {Ext.integer} idGrupo  
 * 
 */
    mostrarGrupo: function(idGrupo) {
        //this.form.find('id_grupo',idGrupo)[0].enable();
        for (var i = 0; i < this.Atributos.length; i++) {
            if (this.Componentes[i] && this.Atributos[i].id_grupo == idGrupo) {
                this.mostrarComponente(this.Componentes[i]);
            }
        }
        this.form.find('id_grupo', idGrupo)[0].show();

    },

/**
 * @function resetGroup
 * @autor Gonzalo Sarmiento Sejas
 * Resetea un grupo a partir de su id
 * @param {Ext.integer} idGrupo  
 * 
 */
    resetGroup: function(idGrupo) {
        for (var i = 0; i < this.Atributos.length; i++) {
            if (this.Componentes[i] && this.Atributos[i].id_grupo == idGrupo) {
                this.Componentes[i].reset();
            }
        }
    },
    
    
 /**
 * @function blockGroup, unblockGroup
 * @autor Ariel Ayaviri Omonte
 * Bloquea o Habilita un grupo a partir de su id
 * @param {Ext.integer} idGrupo  
 * 
 */
	blockGroup: function(idGrupo) {
		this.form.find('id_grupo', idGrupo)[0].disable();
	},
	
	unblockGroup: function(idGrupo) {
        this.form.find('id_grupo', idGrupo)[0].enable();
	},

 /**
 * @function blockGroup, unblockGroup
 * @autor Ariel Ayaviri Omonte
 * Bloquea o Habilita un grupo a partir de su id
 * @param {Ext.integer} idGrupo  
 * 
 */
	readOnlyGroup: function(idGrupo, readOnly) {
		for (var i = 0; i < this.Atributos.length; i++) {
            if (this.Componentes[i] && this.Atributos[i].id_grupo == idGrupo) {
                this.Componentes[i].setReadOnly(readOnly);
            }
        }
	},

    //inicia componentes de la barra de menu
    defineMenu: function(buttons) {
        var cbuttons = buttons || [];
        // definicion de la barra de menu
        if (this.btriguerreturn) {
        	
        	
	            //add basic buttons
	            cbuttons.push({
	                id: 'b-triguerreturn-' + this.idContenedor,
	                iconCls: 'bselect',
	                disabled: true,
	                text: 'SELECCIONAR',
	                tooltip: '<b>Seleccionar</b>',
	                handler: this.onButtonTriguerreturn,
	                scope: this
	            })
            }
        //preguntamos si no hay botones iniciales
        	
        	if(this.initButtons){
        		
        		cbuttons.push(this.initButtons)
        	}  
            

        if (this.bsave) {
            cbuttons.push({
                id: 'b-save-' + this.idContenedor,
                //icon:'../../../lib/imagenes/save.jpg', // icons can also be
                //icon:'../../../lib/imagenes/icono_dibu/dibu_save.png', // icons can also be
                iconCls: 'bsave',
                // specified inline
                tooltip: '<b>Guardar</b>',
                // <-- Add the action directly
                // to a menu
                handler: this.onButtonSave,
                scope: this
            })
            }

        if (this.bnew) {
            cbuttons.push({
                // <-- Add the action
                // directly to a toolbar
                // text: 'Action Menu',
                id: 'b-new-' + this.idContenedor,
                //icon: '../../../lib/imagenes/nuevo.png', // icons can also be
                //icon: '../../../lib/imagenes/icono_dibu/dibu_new.png', // icons can also be
                iconCls: 'bnew',
                // specified inline
                tooltip: '<b>Nuevo</b>',
                // <-- Add the action directly
                // to a menu
                handler: this.onButtonNew,
               
                scope: this
            })
            }

        if (this.bedit) {
            cbuttons.push({
                // <-- Add the
                // action directly
                // to a toolbar
                // text: 'Action Menu',
                id: 'b-edit-' + this.idContenedor,
                //icon: '../../../lib/imagenes/editar.png', // icons can also be
                //icon: '../../../lib/imagenes/icono_dibu/dibu_edit.png', // icons can also be
                iconCls: 'bedit',
                // specified inline
                disabled: true,
                tooltip: '<b>Editar</b>',
                // <-- Add the action directly
                // to a menu
                handler: this.onButtonEdit,
               
                scope: this
            })
            }

        if (this.bdel) {
            cbuttons.push({
                // <-- Add the action
                // directly to a toolbar
                // text: 'Action Menu',
                id: 'b-del-' + this.idContenedor,
                //icon: '../../../lib/imagenes/eliminar.png', // icons can also be
                //icon: '../../../lib/imagenes/icono_dibu/dibu_eli.png', // icons can also be
                iconCls: 'bdel',
                // specified inline
                disabled: true,
                tooltip: '<b>Eliminar</b>',
                // <-- Add the action
                // directly to a menu
                handler: this.onButtonDel,
                scope: this
            })
            }

        if (this.bact) {
            cbuttons.push({
                // <-- Add the action
                // directly to a toolbar
                // text: 'Action Menu',
                id: 'b-act-' + this.idContenedor,
                //icon: '../../../lib/imagenes/actualizar.png', // icons can also be
                //icon: '../../../lib/imagenes/icono_dibu/dibu_act.png', // icons can also be
                iconCls: 'bact',
                // specified inline
                tooltip: '<b>Actuallizar</b>',
                // <-- Add the action
                // directly to a menu
                handler: this.onButtonAct,
                scope: this
            })
            }
          if (this.btest  && Phx.CP.config_ini.mensaje_tec==1) {
            cbuttons.push({
                // <-- Add the action
                // directly to a toolbar
                // text: 'Action Menu',
                id: 'b-test-' + this.idContenedor,
                //icon: '../../../lib/imagenes/actualizar.png', // icons can also be
                //icon: '../../../lib/imagenes/icono_dibu/dibu_act.png', // icons can also be
                iconCls: 'bgood',
                // specified inline
                tooltip: '<b>Probar</b>',
                // <-- Add the action
                // directly to a menu
                handler: this.onButtonTest,
                scope: this
            })
            }   

        //RCM 16/11/2011: Se cambia el boton de excel por un menbu de botones para exportar a excel y pdf
        if (this.bexcel) {
            cbuttons.push({
                id: 'b-excel-' + this.idContenedor,
                //icon: '../../../lib/imagenes/print.gif',
                //icon: '../../../lib/imagenes/icono_dibu/dibu_printer.png',
                iconCls: 'bexport',
                tooltip: '<b>Exportar</b>',

                xtype: 'splitbutton',
                handler: this.onButtonExcel,
                argument: {
                    'news': true,
                    def: 'reset'
                },
                scope: this,
                menu: [{
                    text: 'CSV',
                    iconCls: 'bexcel',
                    argument: {
                        'news': true,
                        def: 'csv'
                    },
                    handler: this.onButtonExcel,
                    scope: this
                }, {
                    text: 'PDF',
                    iconCls: 'bpdf',
                    argument: {
                        'news': true,
                        def: 'pdf'
                    },
                    handler: this.onButtonExcel,
                    scope: this
                }]
                })
            }
        //FIN RCM
        this.tbar = new Ext.Toolbar({
        	enableOverflow: true,
            defaults: {
                scale: 'large'
            },
            items: cbuttons
        });

    },

    onButtonTriguerreturn: function() {
    	var data = this.getSelectedData();
        this.comboTriguer.setValueRec(data);
        Ext.getCmp(this.idContenedor).close();
    },

   
/**
 * @function EnableSelect
 * @autor Rensi Arteaga Copari
 * se ejecuta al seleccionar un evento de grid
 * @param {Ext.tree.node}  n  cuando viene de arbInterfaz, es el nodo selecionado  
 *        {ext.grid.SelectionModel} n   el SelectionModel             
 * 
 */
    EnableSelect: function(n,extra) {
		
        var data = this.getSelectedData();
        
        Ext.apply(data,extra);
        
       this.preparaMenu(n);

        if (this.west) {
             this.onEnablePanel(this.idContenedor + '-west', data, n)
            } else {
            if (this.tabwest) {
                //si estan habilitadas la pestaГ±as ejecuta el reload solo para la visible
                this.onEnablePanel(this.TabPanelWest.getActiveTab().getId(), data, n)
                }
        }
        if (this.south) {
            this.onEnablePanel(this.idContenedor + '-south', data, n)
            } else {
            if (this.tabsouth) {
                //si estan habilitadas la pestaГ±as ejecuta el reload solo para la visible
                this.onEnablePanel(this.TabPanelSouth.getActiveTab().getId(), data, n)
                //console.log('soth....')
                }
        }
        if (this.east) {
            this.onEnablePanel(this.idContenedor + '-east', data, n)
            } else {
            if (this.tabeast) {
                //si estan habilitadas la pestaГ±as ejecuta el reload solo para la visible
                this.onEnablePanel(this.TabPanelEast.getActiveTab().getId(), data, n)
                }
        }
    },
    
       
/**
 * @function DisableSelect
 * @autor Rensi Arteaga Copari
 * se ejecuta al deseleccionar un evento de grid
 * @param {Ext.tree.node}  n  cuando viene de arbInterfaz, es el nodo selecionado  
 *        {ext.grid.SelectionModel} n   el SelectionModel             
 * 
 */

    DisableSelect: function(n) {

        this.liberaMenu(n)
        if (this.west) {
            this.onDisablePanel(this.idContenedor + '-west');
        } else {
            if (this.tabwest) {
                this.onDisablePanel(this.TabPanelWest.getActiveTab().getId())
                }
        }

        if (this.south) {
            this.onDisablePanel(this.idContenedor + '-south');
        } else {
            if (this.tabsouth) {
                this.onDisablePanel(this.TabPanelSouth.getActiveTab().getId())
                //console.log('deshabiliitar')
                }
        }

        if (this.east) {
            this.onDisablePanel(this.idContenedor + '-east');
        } else {
            if (this.tabeast) {
                this.onDisablePanel(this.TabPanelEast.getActiveTab().getId())
                }
        }
    },

    onEnablePanel: function(idPanel, data) {
        var myPanel
        if (typeof idPanel == 'object') {
            myPanel = idPanel
        } else {
            myPanel = Phx.CP.getPagina(idPanel);
        }

        if (idPanel && myPanel) {

            if (myPanel.tipoInterfaz == 'gridInterfaz') {
                myPanel.desbloquearMenus()
                }
            if (myPanel.tipoInterfaz == 'arbInterfaz') {
                myPanel.treePanel.getTopToolbar().enable();
            }
            // recupera
            //myPanel.liberaMenu();
            //cambia el orden por logica el reload se llena con logica del programador
            myPanel.onReloadPage(data);
        }

        delete myPanel;

    },
    onDisablePanel: function(idPanel) {
        var myPanel
		 if (typeof idPanel == 'object') {
            myPanel = idPanel
        } else {
            myPanel = Phx.CP.getPagina(idPanel);
        }

        if (idPanel && myPanel) {
            if (myPanel.tipoInterfaz == 'gridInterfaz') {
                myPanel.bloquearLimpiarMenus()

                }
            if (myPanel.tipoInterfaz == 'arbInterfaz') {
                myPanel.root.removeAll();
                myPanel.treePanel.getTopToolbar().disable();
            }
        }
        delete myPanel;
    },

    getSelectedData: function() {
        if (this.tipoInterfaz == 'gridInterfaz') {
            if (this.sm.getSelected()) {
                return this.sm.getSelected().data
            }

        }
        if (this.tipoInterfaz == 'arbInterfaz') {
            if (this.treePanel.getSelectionModel().getSelectedNode()) {
                return this.treePanel.getSelectionModel().getSelectedNode().attributes
            }
        }
        return undefined
    },

    onTabChange: function(tp, panel) {
        //si la pagiaesta contruida
        if (Phx.CP.getPagina(panel.getId())) {
            //obtenemos el registro seleccionado en el padre y habilitamos el panel hijo
            if (this.getSelectedData()) {
                this.onEnablePanel(panel.getId(), this.getSelectedData())
                } else {
                this.onDisablePanel(panel.getId())
                }
        }
      
    },

    // al seleccionar fila en el grid se habilitan o deshabilitan los botones
    // del menu
    
       
/**
 * @function preparaMenu
 * @autor Rensi Arteaga Copari
 * Prepara (habilita o desabilita botones) el menu segun los datos del nodo o fila estan selecionados  
 * @param {Ext.tree.node}  n  cuando viene de arbInterfaz, es el nodo selecionado  
 *                 
 * 
 */
    
    preparaMenu: function(n) {
    	var tb = this.tbar;
        if (tb && this.bedit) {
            tb.items.get('b-edit-' + this.idContenedor).enable()
            }
        if (tb && this.bdel) {
            tb.items.get('b-del-' + this.idContenedor).enable()
            }
        if (tb && this.btriguerreturn) {
            tb.items.get('b-triguerreturn-' + this.idContenedor).enable()
            }
            
        return tb
    },

  /**
 * @function liberaMenu
 * @autor Rensi Arteaga Copari
 * Prepara (habilita o desabilita botones) el menu segun los datos del nodo o fila estan selecionados  
 * @param {Ext.tree.node}  n  cuando viene de arbInterfaz, es el nodo deselecionados 
 *                 
 * 
 */
    liberaMenu: function() {
        var tb = this.tbar;
        if (tb && this.bsave) {
            tb.items.get('b-save-' + this.idContenedor).enable()
            }
        if (tb && this.bnew) {
            tb.items.get('b-new-' + this.idContenedor).enable()
            }
        if (tb && this.bedit) {
            tb.items.get('b-edit-' + this.idContenedor).disable()
            }
        if (tb && this.bdel) {
            tb.items.get('b-del-' + this.idContenedor).disable()
            }
        if (tb && this.bact) {
            tb.items.get('b-act-' + this.idContenedor).enable()
            }
        if (tb && this.bexcel) {
            tb.items.get('b-excel-' + this.idContenedor).enable()
            }
        if (tb && this.btriguerreturn) {
            tb.items.get('b-triguerreturn-' + this.idContenedor).disable()
            }
        return tb
    },
    
 
   /**
 * @function definirComponentes
 * @autor Rensi Arteaga Copari
 * Inicia los componentes del formulario declaros en el array Atributos              
 * 
 */
    definirComponentes: function() {
    	
    	
    	// map multiple keys to multiple actions by strings and array of codes
			

        if (this.Atributos) {
            this.filters = [];
            this.sw_filters = false;

            if (!this.Grupos) {

                this.Grupos = new Array({

                    xtype: 'fieldset',
                    border: false,
                    // title: 'Checkbox Groups',
                    //autowidth: true,
                    layout: 'form',
                    items: [],
                    id_grupo: 0
                });

            }
            // 
            //recorre todos los atributos de la pagina y va creando los
            // componentes para despues poder agregarlo al formulario de la pagina
            // Se prepara el contenido del store, formulario y grid
            //pone el nuemro de fila
            this.paramCM = [];
            this.paramCM.push(new Ext.grid.RowNumberer());
            if (this.CheckSelectionModel) {
                this.paramCM.push(this.sm);
            }

            this.Componentes = [];
            this.ComponentesGrid = [];
            this.Cmp = [];

            //inicia componetes
            for (var i = 0; i < this.Atributos.length; i++) {
                var ac = this.Atributos[i],
                econfig;
                //para validar si el atributo  forma parte de la interfaz
                var swc = true;
                if (ac.vista) {
                    swc = false;
                    for (var _p in ac.vista) {
                        if (this.nombreVista == ac.vista[_p]) {
                            swc = true;
                            break;
                        }
                    }
                }

                //si el atributo forma parte de la interfaz
                if (swc) {
                    // El atributo es parte del formulario
                    if (ac.form != false) {
                        //se crea el componente
                        this.Componentes[i] = new Ext.form[ac.type](ac.config);

                        //para evento de enter
                         
                        this.Componentes[i].indice=i;
                        
 
                         if(this.tabEnter){
                        
                        this.Componentes[i].on('specialkey',
                        	
                        	function(field,e){
                        		// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
								// e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
								//if (e.{@link Ext.EventObject#getKey getKey()} == e.ENTER) {
								if (e.getKey() == e.ENTER) {
									e.stopEvent()
									var comp = this.getValidComponente(field.indice+1)
									if(comp){
										comp.focus(true,true);
									}
									else{
										this.window.buttons[0].focus();
									}
								}
1
							},this)
						}
						 
                        if (ac.config.allowBlank == false) {
                            this.Componentes[i].fieldLabel = '*' + ac.config.fieldLabel;

                        }

                        this.pushGrupo(this.Componentes[i], this.Grupos, ac.id_grupo)
                        //si el componente es del tipo combo preparamos el store para captura de errores
                        if ((ac.type == 'ComboBox' && ac.config.mode == 'remote') || ac.type == 'AwesomeCombo' || ac.type == 'TrigguerCombo' || ac.type == 'ComboRec') {

                            this.Componentes[i].store.on('exception', this.conexionFailure);
                        }
                       
                         this.Componentes[i].ant_disabled= this.Componentes[i].disabled;
                         //jrr: Se crea un arreglo con los nombres de los atributos
                         this.Cmp[this.Atributos[i].config.name] = this.Componentes [i];

                    }
                    if (this.tipoInterfaz == 'gridInterfaz') {

                        if (ac.grid) {
                            // SE MUESTRA EN EL GRID?
                           
                            if(ac.type == 'MoneyField' && !ac.config.renderer){
                            	ac.config.renderer=Ext.util.Format.CurrencyFactory(2, ",", ".", ac.config.currencyChar , false);
                            }
                            
                           
                            //valores por defecto
                            var tmpConf = {
                                header: ac.config.fieldLabel,
                                align: ac.config.galign ? ac.config.galign: 'left',
                                xtype: ac.config.xtype ? ac.config.xtype: undefined,
                                items: ac.config.items ? ac.config.items: undefined,
                                width: ac.config.gwidth,
                                hidden: ac.config.hidden,
                                renderer: ac.config.renderer,
                                dataIndex: ac.config.gdisplayField?ac.config.gdisplayField:ac.config.name,
                                sortable: ac.config.sortable==false? false: true,
                                dtype: ac.type,
                                gdisplayField: ac.config.gdisplayField,
                                scope:ac.config.scope ? ac.config.scope: undefined
                            }
                            if (ac.egrid) {
                                //si el grid es editable inicializamos componente
                                this.ComponentesGrid[i] = new Ext.form[ac.type](ac.config);
                                if ((ac.type == 'ComboBox' && ac.config.mode == 'remote') || ac.type == 'TrigguerCombo' || ac.type == 'ComboRec') {

                                    this.ComponentesGrid[i].store.on('exception', this.conexionFailure);
                                }

                                this.egrid = true;
                                this.paramCM.push(Ext.apply(tmpConf, {
                                    header: '(e) ' + ac.config.fieldLabel,
                                    editor: this.ComponentesGrid[i]
                                    }));
                            } else {
                                this.paramCM.push(tmpConf)
                                }

                        }

                        // adiciona el filtro a columna de grid
                        if (ac.filters) {
                            	this.sw_filters = true;
                            	ac.filters.dataIndex = ac.config.gdisplayField?ac.config.gdisplayField:ac.config.name
                          		this.filters.push(ac.filters)
                            }
                    }
                }
                
            }
            // fin for componentes
            }
    },

/**
 * @function setFormSize
 * @autor Rensi Arteaga Copari
 * sirve para definir el tamaño de la ventana del formulario, acepta datos porcentuales
 * @param {integer, varchar}  w  ancho
 * @param {integer, varchar}  h  altura
 *                 
 * 
 */


    setFormSize: function(w, h) {
        h = this.calTamPor(h, Ext.getBody())
            this.window.setSize(w, h);
        //this.window.center()
        },
        
 /**
 * @function setFormSize
 * @autor Rensi Arteaga Copari
 * coloca el tamaño por defecto 
 * 
 */      
    setDefFormSize: function() {
        this.window.setSize(this.fwidth, this.fheight);
        //this.window.center()
        },
        
  /**
 * @function setFormSize
 * @autor Rensi Arteaga Copari
 * Contruye el formulario ventana
 *                 
 * 
 */ bodyStyleForm: 'padding:5px;', 
    borderForm: true,
    frameForm: false, 
    paddingForm: '5 5 5 5',
    definirFormularioVentana: function() {

        //define la altura en porcentaje al repecto de body
        this.fheight = this.calTamPor(this.fheight, Ext.getBody())

       
        this.form = new Ext.form.FormPanel({
            id: this.idContenedor + '_W_F',
            //layout:'fit',
            //defaults: {layout:'fit'},
            items: this.Grupos.length >1 ?this.Grupos:this.Grupos[0],
            fileUpload: this.fileUpload,
            padding:this.paddingForm,
            bodyStyle: this.bodyStyleForm,
            border:this.borderForm,
            frame:this.frameForm, 
             autoScroll: false,
            //height: this.fheight,
            autoDestroy: true,
            autoScroll: true
        });
        
      
        // Definicion de la ventana que contiene al formulario
        this.window = new Ext.Window({
            // id:this.idContenedor+'_W',
            title: this.title,
            modal: this.winmodal,
            width: this.fwidth,
            height: this.fheight,
            bodyStyle: 'padding:5px;',
            layout: 'fit',
            hidden: true,
            autoScroll: false,
            maximizable: true,
            buttons: [ {
	                xtype: 'splitbutton',
	                text: '<i class="fa fa-check"></i> Guardar + Nuevo',
	                handler: this.onSubmit,
	                argument: {
	                    'news': true,
	                    def: 'reset'
	                },
	                scope: this,
	                menu: [{
		                    text: 'Guardar + reset',
		                    argument: {
		                        'news': true,
		                        def: 'reset'
		                    },
		                    handler: this.onSubmit,
		                    scope: this
	                	}, 
	                	{
		                    text: 'Guardar + duplicar',
		                    argument: {
		                        'news': true,
		                        def: 'dupli'
		                    },
		                    handler: this.onSubmit,
		                    scope: this
		                }]
                }, 
                {
	                text: '<i class="fa fa-check"></i> Guardar',
	                arrowAlign: 'bottom',
	                handler: this.onSubmit,
	                argument: {
	                    'news': false
	                },
	                scope: this

                },
                {
	                text: '<i class="fa fa-times"></i> Declinar',
	                handler: this.onDeclinar,
					scope: this
               }],
            items: this.form,
            // autoShow:true,
            autoDestroy: true,
            closeAction: 'hide'
        });

    },
   /**
 * @function setFormSize
 * @autor Rensi Arteaga Copari
 * Calula la altura  en valor integer a partir de un porcentaje 
 * y el panel especificado de referencia
 * si manda un integer retorna el mismo valor sin cambiar
 * @param {integer, varchar}  height  ancho
 * @param {Ext.Panel}  panel altura
 *                 
 * 
 */
    calTamPor: function(height, panel) {
        if (Phx.CP._getType(height) == 'string') {
            height = panel.getHeight() * (parseInt(height.substr(0, height.indexOf('%'))) / 100);
            return height;
        }
        return height
    },
    
    /*function:callbackWindowsTab(r,a,o){
    	
    	Phx.CP.callbackWindows(r,a,o)
    	
    	
    },*/
    
    
     /**
 * @function definirRegiones
 * @autor Rensi Arteaga Copari
 * Verifica si tiene hijos definidos 
 * y crear las regiones con los contenedores necesarios
 *                 
 * 
 */  
  
    definirRegiones: function() {
        //si le regios sur esta habilitada
        if (this.south) {
            var params = this.south.params;
            //define la altura en porcentaje al repecto de this.panel
            this.south.height = this.calTamPor(this.south.height, this.panel);
            this.regiones.push(new Ext.Panel({
                id: this.idContenedor + '-south',
                layout: 'fit',
                autoDestroy: true,
                // autoShow:true,
                autoLoad: {
                    url: this.south.url,
                    params: Ext.apply({
                        cls: this.south.cls,
                        _tipo: 'direc',
                        idContenedor: this.idContenedor + '-south',
                        idContenedorPadre: this.idContenedor
                    }, params),
                    text: "Cargando...",
                    callback: Phx.CP.callbackWindows,
                    scope: this,
                    scripts: true
                },
                region: 'south',
                title: this.south.title,
                // collapsible: true,
                // autoShow:true,
                // forceLayout:true,
                height: this.south.height,
                collapsed: this.south.collapsed,
                //height:'80%',
                split: true,
                // enable resizing
                //collapseMode:'mini',
                // floatable:true,
                animCollapse: false,
                minSize: 75,
                collapsible: true
                // defaults to 50
                }))
            } else {
            if (this.tabsouth) {
                var arrayTabs = new Array();
                //define la altura en porcentaje al repecto de body
                this.tabsouth[0].height = this.calTamPor(this.tabsouth[0].height, this.panel);
				 for (var i = 0; i < this.tabsouth.length; i++) {
                    var params=this.tabsouth[i].params;
                    arrayTabs.push({
                        title: this.tabsouth[i].title,
                        id: this.idContenedor + '-south-' + i,
                        layout: 'fit',
                        autoLoad: {
                            url: this.tabsouth[i].url,
                            params: Ext.apply({
                                cls: this.tabsouth[i].cls,
                                _tipo: 'direc',
                                idContenedor: this.idContenedor + '-south-' + i,
                                idContenedorPadre: this.idContenedor
                            }, params),
                            text: "Cargando...",
                            argument: {
                                hola: 'aaaaaa',
                                indice: i
                            },
                            callback: Phx.CP.callbackWindows,
                            scope: this,
                            scripts: true
                        }
                    })
                    
                    
                    }

                this.TabPanelSouth = new Ext.TabPanel({
                    region: 'south',
                    // a center region is ALWAYS required for border layout
                    height: this.tabsouth[0].height,
                    split: true,
                    // enable resizing
                    //deferredRender: false,
                    // layout:'fit',
                    activeTab: 0,
                    // first tab initially active
                    items: arrayTabs
                })

                    this.TabPanelSouth.on('tabchange', this.onTabChange, this);
                   // this.TabPanelSouth.on('afterrender',this.onTabChange,this);
                   
                   //Phx.CP.getPagina(panel.getId())
                   //init
                
                   
                    this.regiones.push(this.TabPanelSouth);
            }
        }

        if (this.west) {
            var params = this.west.params;
            this.regiones.push(new Ext.Panel({
                id: this.idContenedor + '-west',
                layout: 'fit',
                autoDestroy: true,
                // autoShow:true,
                autoLoad: {
                    url: this.west.url,
                    params: Ext.apply({
                        cls: this.west.cls,
                        _tipo: 'direc',
                        idContenedor: this.idContenedor + '-west',
                        idContenedorPadre: this.idContenedor
                    }, params),
                    text: "Cargando...",
                    callback: Phx.CP.callbackWindows,
                    scope: this,
                    scripts: true
                },
                region: 'west',
                collapsible: true,
                title: this.west.title,
                // collapsible: true,
                // autoShow:true,
                // forceLayout:true,
                width: this.west.width,
                split: true,
                collapsed: this.west.collapsed,
                // enable resizing
                //collapseMode:'mini',
                // floatable:true,
                animCollapse: false,
                minSize: 75
                // defaults to 50
                }))
            } else {
            if (this.tabwest) {
                var arrayTabs = new Array();
                for (var i = 0; i < this.tabwest.length; i++) {
                    
                    var params=this.tabwest[i].params;
                    arrayTabs.push({
                        title: this.tabwest[i].title,
                        id: this.idContenedor + '-west-' + i,
                        layout: 'fit',
                        autoLoad: {
                            url: this.tabwest[i].url,
                            params: Ext.apply({
                                cls: this.tabwest[i].cls,
                                _tipo: 'direc',
                                idContenedor: this.idContenedor + '-west-' + i,
                                idContenedorPadre: this.idContenedor
                            }, params),
                            text: "Cargando...",
                            argument: {
                                hola: 'aaaaaa',
                                indice: i
                            },
                            callback: Phx.CP.callbackWindows,
                            scope: this,
                            scripts: true
                        }
                    })
                    }

                this.TabPanelWest = new Ext.TabPanel({
                    region: 'west',
                    // a center region is ALWAYS required for border layout
                    width: this.tabwest[0].width,
                    split: true,
                    // enable resizing
                    activeTab: 0,
                    // first tab initially active
                    minSize: 75,
                    // defaults to 50
                    items: arrayTabs
                })

                    this.TabPanelWest.on('tabchange', this.onTabChange, this);
                //this.TabPanelSouth.on('afterrender',this.onTabChange);
                this.regiones.push(this.TabPanelWest);
            }
        }
        if (this.east) {
            var params = this.east.params;

            this.regiones.push(new Ext.Panel({
                id: this.idContenedor + '-east',
                layout: 'fit',
                autoDestroy: true,
                // autoShow:true,
                autoLoad: {
                    url: this.east.url,
                    params: Ext.apply({
                        cls: this.east.cls,
                        _tipo: 'direc',
                        idContenedor: this.idContenedor + '-east',
                        idContenedorPadre: this.idContenedor
                    }, params),
                    text: "Cargando...",
                    callback: Phx.CP.callbackWindows,
                    /*callback:function(r,a,o){
								  // Al retorno de de cargar la ventana
								  // ejecuta la clase que llega en el parametro
     							// cls
							 eval('Phx.CP.setPagina(new Phx.vista.'+this.east.cls+'(o.argument.params))')
						   },*/
                    scope: this,
                    scripts: true
                },

                region: 'east',
                title: this.east.title,
                collapsible: true,
                width: this.east.width,
                collapsed: this.east.collapsed,
                split: true,
                // enable resizing
                //collapseMode:'mini',
                // floatable:true,
                animCollapse: false,
                minSize: 75
                // defaults to 50
                }))
            } else {
            if (this.tabeast) {
                var arrayTabs = new Array();
                for (var i = 0; i < this.tabeast.length; i++) {
                    arrayTabs.push({
                        title: this.tabeast[i].title,
                        id: this.idContenedor + '-east-' + i,
                        layout: 'fit',
                        autoLoad: {
                            url: this.tabeast[i].url,
                            //params:Ext.apply({cls:this.tabeast[l.argument.indice].cls,_tipo:'direc',idContenedor:this.idContenedor+'-east-'+i,idContenedorPadre:this.idContenedor},params),
                            params: Ext.apply({
                                cls: this.tabeast[i].cls,
                                _tipo: 'direc',
                                idContenedor: this.idContenedor + '-east-' + i,
                                idContenedorPadre: this.idContenedor
                            }, params),
                            text: "Cargando...",
                            argument: {
                                hola: 'aaaaaa',
                                indice: i
                            },
                            callback: Phx.CP.callbackWindows,
                            /*callback:function(r,a,o,l){
				            //console.log(this,this.tabsouth,this.tabsouth[i].cls)
								  // Al retorno de de cargar la ventana
								  // ejecuta la clase que llega en el parametro
									// cls
							 eval('Phx.CP.setPagina(new Phx.vista.'+this.tabeast[l.argument.indice].cls+'(o.argument.params))')
						   },  */
                            scope: this,
                            scripts: true
                        }
                    })
                    }

                this.TabPanelEast = new Ext.TabPanel({
                    region: 'east',
                    // a center region is ALWAYS required for border layout
                    width: this.tabeast[0].width,
                    split: true,
                    // enable resizing
                    activeTab: 0,
                    // first tab initially active
                    minSize: 75,
                    // defaults to 50
                    items: arrayTabs
                })

                    this.TabPanelEast.on('tabchange', this.onTabChange, this);
                //this.TabPanelSouth.on('afterrender',this.onTabChange);
                this.regiones.push(this.TabPanelEast);
            }
        }
        //this.regiones.push();
       
        this.BorderLayout = new Ext.Container({
            split: true,
            flex:1,
            autoScroll:true,
            region:'center',
            //width: 200,
            plain: true,
            layout: 'border',
            items: this.regiones

        });
        //////////////////////////////////////\\
        
        
        
        
       
        if(this.xeast){
        	
        	this.xLayout=new Ext.Panel({
                id: this.idContenedor + '-xeast',
                region: 'east',
                layout: 'fit',
                flex:2,
                //columnWidth:.50,
                width:'50%',
                autoDestroy: true,
                // autoShow:true,
                autoLoad: {
                    url: this.xeast.url,
                    params: Ext.apply({
                        cls: this.xeast.cls,
                        _tipo: 'direc',
                        idContenedor: this.idContenedor + '-xeast',
                        idContenedorPadre: this.idContenedor
                    }, params),
                    text: "Cargando...",
                    callback: Phx.CP.callbackWindows,
                    scope: this,
                    scripts: true
                },

               // region: 'east',
                title: this.xeast.title,
                collapsible: true,
                width: this.xeast.width,
                  split: true,
                //split: true,
                // enable resizing
                //collapseMode:'mini',
                // floatable:true,
                animCollapse: false,
                minSize: 75
                // defaults to 50
                });        	
        	
        	this.panelSec =  new Ext.Panel({
        		layout: 'border',
        		  autoScroll:true,
				
                items:[
                   this.BorderLayout,
                   this.xLayout
                    
                   ]
                
        		
        	})
           this.panel.add(this.panelSec);
        
        }
        else{
        	 this.panel.add(this.BorderLayout);
        }
        
        
        
        
        //this.panel.add(this.treePanel);
        this.panel.on('beforedestroy', this.onDestroy, this);
        this.panel.on('beforehide', this.onHide, this);
        this.panel.on('beforeshow', this.onShow, this);

    },
    defRegion:'center',
/**
 * @function onReloadPage
 * @autor Rensi Arteaga Copari
 * Esta funcion se sobercarga cuando la interface funciona como hijo
 * sirve para definir valor iniciales recibi los datos del nodo o fila seleccionado en el padre
 * @param {Object}  Configuracion del panel padre
  *                 
 * 
 */
    onReloadPage: function(origen) {
        alert("es necesario sobrecargar la funcion onReloadPage")
        },

    getIdContenedor: function() {
        return this.idContenedor;
    },
    
    getValidComponente:function(h){
    	for(h;h<=this.Componentes.length;h++){
    		if(this.Componentes[h] && !this.Componentes[h].disabled && this.Componentes[h].inputType!='hidden'){
        		
        		if  (this.Atributos[h].type=='RadioGroupField'){
        			return this.Componentes[h].items[0]
        		}
        		else{
        			return this.Componentes[h];
        		}
        			break;
        	}
        }
        return undefined;
    },
    
    /* obtiene el primer atribuo distinto de hidden */
    getIndAtributoNotHidden: function(h) {
        //console.log('cont1:',this.idContenedor);
       
        for(h;h<this.Atributos.length;h++){
        	if(this.Atributos[h].config.inputType!='hidden'){
        		break;
        	}
        }
        return h;
    },
     /*  
	 *  captura y concatena errores
	 * */
    addLog:function(resp){
    	
    	
    	
    	// No aceptable
				var reg = Ext.util.JSON.decode(Ext.util.Format.trim(resp.responseText));
				console.log('registros de error',reg)
				if(Phx.CP.config_ini.mensaje_tec==1){
				  mensaje="<p><br/> <b>Mensaje:</b> " + reg.ROOT.detalle.mensaje +"<br/><b>Capa:</b> " + reg.ROOT.detalle.capa +"<br/><b>Origen:</b> " + reg.ROOT.detalle.origen +"<br/><b>Procedimiento:</b> " + reg.ROOT.detalle.procedimiento +"<br/><b>Transacción:</b> " + reg.ROOT.detalle.transaccion+"<br/><b>Consulta:</b> " + reg.ROOT.detalle.consulta +"<br/><b>Mensaje Técnico:</b> " + reg.ROOT.detalle.mensaje_tec +"</p>";
				}
				else{
					mensaje="<p><br/> Mensaje: " + reg.ROOT.detalle.mensaje +"<br/> </p>"
				}
    	
    	this.log=this.log +mensaje;
    	
    	window.open('../../../lib/lib_vista/log.php?log='+this.log+'&titulo='+this.title)
    },
 
    /*
	 *  Inicia y contruye la interface tipo arbol 
	 *  con los parametros de la clase hija
	 * 
	 * */
    constructor: function(config) {
    	
		// Default headers to pass in every request
		Ext.Ajax.defaultHeaders = {
		    'Powered-By': 'KPLIAN-PXP'
		};
		
		//RCM 05/02/2013: función para agregar componentes eninterfases heredadas    	
    	this.agregarComponentesExtra();
    	//FIN RCM
    	
   	
        //inicia variable
        //array para que las interfases finales envien argumentos adicionales por el submit
        this.argumentExtraSubmit = {};
        //array para que las clases que heredan directo de baseInterfaz (gridInterfaz, frmInterfaz, etc.) envien argumentos por submit
        this.argumentBaseSubmit = {};
        //Copia la configuracion definida en la clases tipo Interfa-N
        if (config.comboTriguer) {
            this.btriguerreturn = true;
        }
        
        Ext.apply(this, config);
        Phx.baseInterfaz.superclass.constructor.call(this);
        
        delete config;
        this.panel = Ext.getCmp(this.idContenedor);

        //verifica si a ventana se abre desde un cobmo triguer para
        //inicar el boton para regreso de datos
        
        this.addEvents('init');

        },

    //cuendo una ventana es reutilizada hacemos un recargar de los datos para ahorrar tiempo de ejecucion y transferencia
    onReload: function(origen) {
        alert("es necesario sobrecargar la funcion onReload")
    },
    
	agregarComponentesExtra: function(){
		//RCM: 05/02/2013: optimizar el recorrido del array
		//TODO: aumentar lógica para aumentar los componentes en lugares específicos 
    	//console.log('atributos',this.Atributos.length);
    	//console.log('atributos extra',this.AtributosExtra.length);
    	if(this.AtributosExtra){
    		//Ext.apply(this.Atributos,this.AtributosExtra);
	    	for(var i = 0; i < this.AtributosExtra.length; i++){
	    		this.Atributos.push(this.AtributosExtra[i])
	    	}    		
    	}
		
	},
	setAllowBlank : function (cmp, blank) {
		
		cmp.allowBlank = blank;
		
		if (blank === true) {
			cmp.fieldLabel = cmp.fieldLabel.replace('*', '')
			cmp.label.update(cmp.fieldLabel);			
		} else {
			if (cmp.fieldLabel.indexOf('*') === -1) {
				cmp.fieldLabel = '*' + cmp.fieldLabel;
				cmp.label.update(cmp.fieldLabel);
			}
		}
	}
	
	
       

});