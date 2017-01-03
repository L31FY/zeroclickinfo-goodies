DDH.interactive_bmi_calculator = DDH.interactive_bmi_calculator || {};
DDH.interactive_bmi_calculator.build = function(ops) {

    return {
        onShow: function(){
            var $height_ft = $("#bmi_height_ft"),
                $height_in = $("#bmi_height_in");

            var $weight = $("#bmi_weight");
            var is_metric = DDG.settings.get('kaj') === 'm';
            updateUnits();

            $(".bmi_var").keydown(function(evt) {
                $(this).removeClass("bmi_error");

                if (evt.keyCode === 13) { //Enter
                    var height;// = $height.val()? parseFloat($height.val()) : null;
                    var weight = $weight.val()? parseFloat($weight.val()) : null;
                    var error = "bmi_error";
                    var bmi;

                    if(!is_metric) {
                        var height_feet = $height_ft.val()? parseFloat($height_ft.val()) : 0,
                            height_inch = $height_in.val()? parseFloat($height_in.val()) : 0;
                        
                        height = height_feet * 12 + height_inch;

                        // When using imperial units the formula is slightly different
                        weight = weight * 703;
                    } else {
                        height = $height_ft.val()? (parseFloat($height_ft.val()) / 100) : 0;
                    }

                    //Calculate BMI
                    if ($.isNumeric(weight) && height !== 0) {
                        
                        bmi = weight / (height * height);
                        
                        // Truncate all decimal digits but the first
                        var bmi_arr = bmi.toString().split(".");
                        if (bmi_arr[1] && (bmi_arr[1].charAt(0) !== "0")) {
                            bmi = bmi_arr[0] + "." + bmi_arr[1].charAt(0);
                        } else {
                            bmi = bmi_arr[0];
                        }
                    } else {
                        if ((!$.isNumeric(height)) || (height === 0)) {
                            $height_in.addClass(error);
                            $height_ft.addClass(error);
                            $height_cm.addClass(error);
                        }
                        
                        if (!$.isNumeric(weight)) {
                            $weight.addClass(error);
                        }
                    }

                    $("#bmi_result").val(bmi);
                }
            });

            $(".bmi_switch").click(function(evt) {
                is_metric = $(this).attr("id") === "bmi_metric";
                updateUnits();
                
                //Update settings in the cloud too
                DDG.settings.set('kaj', is_metric? 'm' : 'u', { saveToCloud: true });
            });

            function updateUnits() {
                var selected = "tx-clr--dk";
                var unselected = "tx-clr--lt";
                $("." + selected).removeClass(selected).addClass(unselected);

                var units = is_metric? "metric" : "imperial";
                $("#bmi_" + units).addClass(selected).removeClass(unselected);
                
                if(is_metric) {
                    $weight.attr("placeholder", "kg");
                    $height_ft.attr("placeholder","cm").removeClass("forty").addClass("sixty");
                    $height_in.addClass("hide");
                } else {
                    $weight.attr("placeholder", "lbs").val("");
                    $height_ft.attr("placeholder","feet").addClass("forty").removeClass("sixty");
                    $height_in.removeClass("hide");
                }
                $("#bmi_result").val("");
                $weight.val("");
                $height_ft.val("");
                $height_in.val("");
            }
        }
    };
};