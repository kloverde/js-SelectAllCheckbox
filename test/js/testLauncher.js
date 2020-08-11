/*
 * SelectAllCheckbox
 * https://www.github.com/kloverde/js-SelectAllCheckbox
 *
 * Copyright (c) 2020, Kurtis LoVerde
 * All rights reserved.
 *
 * Donations:  https://paypal.me/KurtisLoVerde/5
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     1. Redistributions of source code must retain the above copyright
 *        notice, this list of conditions and the following disclaimer.
 *     2. Redistributions in binary form must reproduce the above copyright
 *        notice, this list of conditions and the following disclaimer in the
 *        documentation and/or other materials provided with the distribution.
 *     3. Neither the name of the copyright holder nor the names of its
 *        contributors may be used to endorse or promote products derived from
 *        this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

( function() {
   "use strict";

   var groupName = "group";
   var checkboxContainer;
   var affectedBoxes = null;
   var groupState = null;

   $( document ).ready( function() {
      checkboxContainer = $( "#checkboxContainer" );
   } );

   function callback( boxes, checkedState ) {
      affectedBoxes = boxes;
      groupState = checkedState;
   }

   function resetCallback() {
      affectedBoxes = null;
      groupState = null;
   }

   function initGroup( boxConfig ) {
      checkboxContainer.html( "" );

      // Create the select-all checkbox
      $( "<input/>", {
         type : "checkbox",
         id   : "selectAll",
      } ).appendTo( checkboxContainer );

      // Create the rest of the checkboxes
      for( var i = 0; i < boxConfig.length; i++ ) {
         var box = $( "<input/>", {
            type : "checkbox",
            id   : "box" + i,
            name : groupName
         } );

         if( !boxConfig[i].enabled ) {
            box.prop( "disabled", true );
         }

         if( boxConfig[i].checked ) {
            box.prop( "checked", true );
         }

         box.appendTo( checkboxContainer );
      }

      new CheckboxGroup(
         "selectAll",
         groupName,
         callback
      );
   }

   function log( msg ) {
      console.log( msg );
   }

   function validateCallback( expectedCallbackChanged, expectedCallbackGroupState ) {
      var expectedCallbackChangedNotJqueryObjects = [];

      if( expectedCallbackChanged == null || expectedCallbackChanged.length === 0 ) {
         equal( affectedBoxes, null, "Expecting nothing to change, so the callback should not fire (affected boxes)" );
      } else {
         for( var i = 0; i < affectedBoxes.length; i++ ) {
            expectedCallbackChangedNotJqueryObjects.push( parseInt(affectedBoxes[i].id.replace("box", "")) );
         }

         equal( (affectedBoxes == null ? 0 : affectedBoxes.length), (expectedCallbackChanged == null ? 0 : expectedCallbackChanged.length), "The number of expected vs. affected boxes must be the same" );
         deepEqual( expectedCallbackChangedNotJqueryObjects, expectedCallbackChanged, "The affected boxes reported by the callback are " + expectedCallbackChanged );
      }

      if( expectedCallbackGroupState == null ) {
         equal( groupState, null, "Expecting nothing to change, so the callback should not fire (checkbox group state)" );
      } else {
         equal( groupState, expectedCallbackGroupState, "The group state reported by the callback is '" + expectedCallbackGroupState + "'" );
      }
   }

   function validateSelectAll( expected, isInit ) {
      var selectAll = $( "#selectAll" );

      if( expected === SelectAllState.CHECKED ) {
         ok( selectAll.is(":checked"), "The select-all checkbox should be CHECKED " + (isInit ? "at initialization" : "") );
         equal( selectAll.prop("indeterminate"), false, "The select-all checkbox should not be indeterminate " + (isInit ? "at initialization" : "") );
      } else if( expected === SelectAllState.NOT_CHECKED ) {
         notOk( selectAll.is(":checked"), "The select-all checkbox should be NOT CHECKED " + (isInit ? "at initialization" : "") );
         equal( selectAll.prop("indeterminate"), false, "The select-all checkbox should not be indeterminate " + (isInit ? "at initialization" : "") );
      } else if( expected === SelectAllState.PARTIALLY_CHECKED ) {
         notOk( selectAll.is(":checked"), "The select-all checkbox should be NOT CHECKED " + (isInit ? "at initialization" : "") );
         equal( selectAll.prop("indeterminate"), true, "The select-all checkbox should be indeterminate " + (isInit ? "at initialization" : "") );
      } else {
         throw "Unknown value for expected: " + expected;
      }
   }

   function validateBoxStates( expectedBoxStates ) {
      var boxStateIdx = 0;

      $( "input[name='group']" ).each( function() {
         var box = $( this );
         equal( box.is(":checked"), expectedBoxStates[boxStateIdx], "Verify " + box.attr("id") + " is " + (expectedBoxStates[boxStateIdx] ? "checked" : "not checked") );
         boxStateIdx++;
      } );
   }

   QUnit.config.hidepassed = false;

   QUnit.cases( testCases ).test( "Test", function(params) {
      initGroup( params.boxes );
      validateSelectAll( params.expectedSelectAllOnInit, true );

      if( params.clickScript != undefined && params.clickScript != null ) {
         for( var i = 0; i < params.clickScript.length; i++ ) {
            var click = params.clickScript[i];

            resetCallback();

            if( isNaN(click.whichBox ) ) {
               $( "#" + click.whichBox ).click();
            } else {
               $( "#box" + click.whichBox ).click();
            }

            validateCallback( click.expectedCallbackChanged, click.expectedCallbackGroupState );
            validateSelectAll( click.expectedSelectAllState, false );
            validateBoxStates( click.expectedBoxStates );
         }
      }
   } );

   QUnit.jUnitDone( function(report) {
      document.getElementById( "done" ).style.visibility = "visible";

      if( typeof console !== "undefined" ) {
         console.log( report.xml );  // TODO:  Probably need Grunt integration to run a server to upload this to
      }
   } );
} )();
