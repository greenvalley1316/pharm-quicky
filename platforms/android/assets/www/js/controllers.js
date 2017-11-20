angular.module('starter.controllers', [])


  /* ============================================================================ */
  /* ***************************** LOGIN CONTROLLER ***************************** */

  .controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicHistory, $ionicLoading, $localStorage, $http, $ionicPopup) {

    

    $scope.$on("$ionicView.enter", function (event, data) {
      checkLogin();
      $ionicHistory.clearCache();
    });

    $scope.user = {};

    $scope.submitLogin = function (item) {

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });

      if ((item.phoneNo == "" || item.phoneNo == null) && (item.password == "" || item.password == null)) {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Please Enter Mobile Number and Password',
          duration: 2000
        });
        return;
      } else if (item.phoneNo == "" || item.phoneNo == null) {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Please Enter Mobile Number',
          duration: 2000
        });
        return;
      } else if (item.phoneNo.length != 10) {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Mobile Number must be 10 digits',
          duration: 2000
        });
        return;
      } else if (item.password == "" || item.password == null) {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Please Enter Password',
          duration: 2000
        });
        return;

      } else {
        var data = $.param({
          phno: item.phoneNo,
          password: item.password
        });

        var url = 'http://61.16.131.205/pharmquicky/api/user_login?' + data;
        $http.get(url)
          .then(function (response) {
            if (response.data.status == "success") {
              $localStorage.login = response.data.status;
              $localStorage.userData = response.data.userdata;
              $ionicLoading.hide();

              $state.go('tab.home');
            } else {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Warning!',
                template: '<p align="center">' + response.data.message + '</p>'
              })
            }
          }, function (reject) {
            // error handler 
            $ionicLoading.hide();
            $ionicLoading.show({
              template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
              duration: 2500
            });
          });
      }
    }

    $scope.goToSignupOtp = function () {
      $state.go('otp');
    }

    $scope.goToForgotPwOtp = function () {
      $state.go('forgotpassword_otp');
    }

    function checkLogin() {
      if ($localStorage.login) {
        $state.go('tab.home');
      } else {
        $ionicHistory.clearHistory();
        // $scope.login = {
        //   usrMobileNo: '',
        //   usrPassword: ''
        // };
      }
    }
  })
  /* ***************************** LOGIN CONTROLLER FINISHED ***************************** */


  /* ========================================================================== */
  /* ***************************** OTP CONTROLLER ***************************** */

  .controller('OtpCtrl', function ($rootScope, $scope, $state, $ionicHistory, $ionicLoading, $ionicPopup, $http, $localStorage) {

    $scope.$on("$ionicView.enter", function (event, data) {
      checkLogin();
    });

    $scope.isOtp = false;

    function checkLogin() {
      if ($localStorage.login) {
        $state.go('tab.dash');
      } else {
        $scope.signup = {
          usrMobileNo: '',
          usrOTP: ''
        };
      }
    }

    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.goBack();
    };

    var getOTP = "";
    var u_id = "";
    $scope.otp = '';
    $rootScope.u_id = '';

    $scope.userInfo = {};

    $scope.resendOtp = function (item) {
      console.log("++++++++++++++++++ OTP resend called ++++++++++++++++")
    }

    //###- Generating OTP -###
    $scope.sendOtp = function (item) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
      if (item.phone.length != 10) {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Mobile Number must be 10 digits',
          duration: 2000
        });
      } else {
        var data = $.param({
          phno: item.phone
        });
        var url = 'http://61.16.131.205/pharmquicky/api/user_registration_s1?' + data;
        $http.get(url)
          .then(function (response) {
            if (response.data.status == "success") {
              $scope.isOtp = true;
              // setTimeout(function() {
              //   $scope.resendBtn = true;
              // }, 5000);
              $ionicLoading.hide();
              getOTP = response.data.otpdata.otp_code;
              u_id = response.data.otpdata.user_id;
              $scope.otp = getOTP;
              $rootScope.u_id = u_id;
              $rootScope.currentRegMobileNo = item.phone;
              console.log("++++++++++++++ OTP " + $scope.otp);
              console.log("++++++++++++++ user id " + $scope.u_id);
            } else {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Warning!',
                template: '<p align="center">' + response.data.message + '</p>'
              });
            }
          }, function (reject) {
            // error handler 
            $ionicLoading.hide();
            $ionicLoading.show({
              template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
              duration: 2500
            });
          });
      }
    }

    //###- Validating OTP -###
    $scope.validateOtp = function (otp) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
      if (otp == "") {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Please Enter Your Valid OTP',
          duration: 2000
        });
      } else {
        var data = $.param({
          uid: u_id,
          otp: otp
        });
        console.log("------------------------ data2 " + data);
        var url2 = 'http://61.16.131.205/pharmquicky/api/user_registration_s2?' + data;
        $http.get(url2)
          .then(function (response) {
            if (response.data.status == "success") {
              $ionicLoading.hide();
              $state.go('registration');
            } else {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Warning!',
                template: '<p align="center">' + response.data.message + '</p>'
              });
            }
          }, function (reject) {
            // error handler 
            $ionicLoading.hide();
            $ionicLoading.show({
              template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
              duration: 2500
            });
          });
      }
    }
  })
  /* ********************** OTP CONTROL FINISHED ********************** */


  /* ========================================================================== */
  /* ***************************** REGISTER CONTROLLER ************************* */

  .controller('RegisterCtrl', function ($rootScope, $scope, $state, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $scope.submitRegistration = function (item) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
      console.log("%%%%%%%%%% " + $rootScope.currentRegMobileNo);
      if (item.usrPassword == item.usrCnfrmPassword) {

        if ($rootScope.currentRegMobileNo == null || $rootScope.currentRegMobileNo == "") {
          $ionicLoading.hide();

          $ionicLoading.show({
            template: 'Problem in registration, Please try again from start',
            duration: 2000
          });

        } else {
          var data = $.param({
            uid: $rootScope.u_id,
            name: item.usrName,
            email_id: item.usrEmail,
            password: item.usrPassword,
            zip_code: item.usrPin
          });

          var url = 'http://61.16.131.205/pharmquicky/api/user_registration_s3?' + data;

          $http.get(url)
            .then(function (response) {
              if (response.data.status == "success") {
                $ionicLoading.hide();
                $ionicLoading.show({
                  template: '<strong>Registration sussessful.</strong><br>Please Login to continue',
                  duration: 2500
                });
                $state.go('login');
              } else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Warning!',
                  template: '<p align="center">' + response.data.message + '</p>'
                });
              }
            }, function (reject) {
              // error handler 
              $ionicLoading.hide();
              $ionicLoading.show({
                template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
                duration: 2500
              });
            });
        }
      } else {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Password does not Match',
          duration: 2000
        });
      }
    }

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    // function checkLogin() {
    //   if ($localStorage.login) {
    //     $state.go('tab.home');
    //   } else {
    //     $scope.signup = {
    //       usrMobileNo: '',
    //       usrOTP: ''
    //     };
    //   }
    // }
  })
  /* ************************* Register Control Finished ********************** */


  /* ========================================================================== */
  /* ********************* FORGOT PASSWORD OTP CONTROLLER ********************* */

  .controller('OtpForgotPwCtrl', function ($rootScope, $scope, $state, $ionicHistory, $ionicLoading, $ionicPopup, $http, $localStorage) {

    $scope.$on("$ionicView.enter", function (event, data) {
      checkLogin();
    });

    $scope.isOtp = false;
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.goBack();
    };

    //var getOTP = "";
    var getOTPdata = {};
    var u_id = "";
    $scope.otp = '';
    $rootScope.u_id = '';    
    $scope.userInfo = {};

    $scope.resendOtp = function (item) {
      console.log("++++++++++++++++++ OTP resend called ++++++++++++++++")
    }

    
    //###- Generating OTP -###
    $scope.sendOtp = function (item) {
      if(item.phone == "" || item.phone == null){
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Please Enter Mobile Number',
          duration: 1000
        });
        return;
      } else {
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        if (item.phone.length != 10) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: 'Mobile Number must be 10 digits',
            duration: 2000
          });
        } else {
          var data = $.param({
            phno: item.phone
          });
          var url = 'http://61.16.131.205/pharmquicky/api/forget_password_step1?' + data;
          $http.get(url)
            .then(function (response) {
              if (response.data.status == "success") {
                $scope.isOtp = true;
                $ionicLoading.hide();
                getOTPdata = response.data.otpdata;
                u_id = getOTPdata.user_id;
                $scope.otp = getOTPdata.otp_code;
                $rootScope.u_id = u_id;
                $rootScope.registeredMobileNo = item.phone;                
              } else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Warning!',
                  template: '<p align="center">' + response.data.message + '</p>'
                });
              }
            }, function (reject) {
              // error handler 
              $ionicLoading.hide();
              $ionicLoading.show({
                template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
                duration: 2500
              });
            });
        }
      }      
    }

    //###- Validating OTP -###
    $scope.validateOtp = function (otp) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
      if (otp == "") {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: 'Please Enter Your Valid OTP',
          duration: 2000
        });
      } else {
        var data = $.param({
          user_id: u_id,
          otp: otp
        });
        console.log("------------------------ data2 " + data);
        var url2 = 'http://61.16.131.205/pharmquicky/api/forget_password_step2?' + data;
        $http.get(url2)
          .then(function (response) {
            if (response.data.status == "success") {
              $ionicLoading.hide();
              $state.go('forgotpassword');
            } else {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Warning!',
                template: '<p align="center">' + response.data.message + '</p>'
              });
            }
          }, function (reject) {
            // error handler 
            $ionicLoading.hide();
            $ionicLoading.show({
              template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
              duration: 2500
            });
          });
      }
    }

    function checkLogin(){
      if($localStorage.login){
        $state.go('tab.home');
      }else{
        $scope.login = { 
          phone: '', 
          otp: ''
        };
      }
    }
  })
  /* ******************** END FORGOT PASSWORD OTP CONTROLLER ****************** */


  /* ========================================================================== */
  /* ************************ FORGOT PASSWORD CONTROLLER ********************** */

  .controller('ForgotPassCtrl', function ($scope, $rootScope, $state, $http, $ionicHistory, $ionicLoading, $ionicPopup) {

    $scope.saveNewPass = function (item) {       
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        console.log("%%%%%%%%%% " + $rootScope.registeredMobileNo);
        if (item.newPass == item.cnfrmPass) {
          if ($rootScope.registeredMobileNo == null || $rootScope.registeredMobileNo == "") {
            $ionicLoading.hide();
            $ionicLoading.show({
              template: 'Problem in password reset. <br>Please try again by clicking on "Forgot Password" in Login page',
              duration: 2500
            });
          } else {
            var data = $.param({
              user_id: $rootScope.u_id,            
              password: item.newPass
            });
  
            var url = 'http://61.16.131.205/pharmquicky/api/forget_password_step3?' + data;
  
            $http.get(url)
              .then(function (response) {
                if (response.data.status == "success") {
                  $ionicLoading.hide();
                  $ionicLoading.show({
                    template: '<strong>Password successfully changed.</strong><br>Login with new password to continue',
                    duration: 2500
                  });
                  $state.go('login');
                } else {
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: 'Warning!',
                    template: '<p align="center">' + response.data.message + '</p>'
                  });
                }
              }, function (reject) {
                // error handler 
                $ionicLoading.hide();
                $ionicLoading.show({
                  template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
                  duration: 2000
                });
              });
          }
        } else {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: 'Password does not Match',
            duration: 2000
          });
        }   
      
    }

    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.goBack();
    };

    function checkLogin() {
      if ($localStorage.login) {
        $state.go('tab.home');
      } else {
        $scope.login = {
          phone: ''
        };
      }
    }    
  })

  //---------------------------------- END -------------------------------------




  //----------------------------------------------------------------------------
  //-------------------------- DASH-BOARD CONTROLLERS ---------------------------

  .controller('tabsCtrl', function ($scope) {
    $scope.badgeCountOrder = 2;
    $scope.badgeCountNotif = 1;
  })

  .controller('HomeTabCtrl', function ($scope, $rootScope, $state, $ionicModal) {
    $scope.badgeCountOrder = 2;
    $scope.showCart = function () {
      $state.go('cart');
    }
    $scope.gotoProfileTab = function () {
      $state.go('tab.myprofile');
    }
    $scope.gotoOrderTab = function () {
      $state.go('tab.orders');
    }
    $scope.gotoNotifTab = function () {
      $state.go('tab.notifications');
    }
    $scope.tempGotoMedDetails = function () {
      $state.go('medicine_details');
    }

    $scope.openPincodeModal = function (rootValue) {
      console.log("Clicked button is: "+rootValue);
      $rootScope.parentPageClickedButton = rootValue;
      $scope.modal.show();
    };
    $scope.closePincodeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    //------------------------- Pincode Modal Page ----------------------
    $ionicModal.fromTemplateUrl('templates/modal-pincode.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function ($ionicModal) {
      $scope.modal = $ionicModal;

      $scope.gotoMedicine = function() {
        console.log("The $rootScope value is: "+$rootScope.parentPageClickedButton);
        if($rootScope.parentPageClickedButton == 'otc') {
          $scope.modal.hide();
          $state.go('search_OTC');
        } else {
          $scope.modal.hide();
          $state.go('upload_prescription');
        }
      }
    });
    //---------------------- Modal Finished -----------------

    
    

  })

  .controller('OrdersTabCtrl', function ($scope, $state) {
    $scope.showCart = function () {
      $state.go('cart');
    }
  })

  .controller('NotificationsTabCtrl', function ($scope, $state) {
    $scope.showCart = function () {
      $state.go('cart');
    }
  })

  .controller('MyprofileTabCtrl', function ($scope, $state, $ionicModal, $ionicPopup, $ionicHistory, $localStorage) {
    $scope.gotoLogin = function () {
      $state.go('login');
    }
    $scope.showCart = function () {
      $state.go('cart');
    }

    //------------------------- Change Password Modal Page ----------------------
    $ionicModal.fromTemplateUrl('templates/modal-change-password.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function ($ionicModal) {
      $scope.modal = $ionicModal;
    });
    $scope.openChangePassModal = function () {
      $scope.modal.show();
    };
    $scope.closeChangePassModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });
    //--------------------------- Modal Finished -------------------

    //------------------------- Edit Profile Modal Page ----------------------
    $ionicModal.fromTemplateUrl('templates/modal-edit-profile.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function ($ionicModal) {
      $scope.modal2 = $ionicModal;
    });
    $scope.openEditProfileModal = function () {
      $scope.modal2.show();
    };
    $scope.closeEditProfileModal = function () {
      $scope.modal2.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal2.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal2.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal2.removed', function () {
      // Execute action
    });
    //--------------------------- Modal Finished -------------------

    $scope.logout = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Logout',
        template: '<p align="center">Are you sure you want to Logout?</p>',
        cancelText: 'Cancel',
        okText: 'Yes'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> " + $localStorage);
          $localStorage.$reset();
          console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<< " + $localStorage);
          // $ionicHistory.clearCache();
          // $ionicHistory.clearHistory();
          // $state.go('login');

          checkLogin();
        } else {
          console.log('You are not sure');
        }
      });
      //$localStorage.userData = {};
      // $localStorage= {};
      //$localStorage.userData = null;
      //window.location = "#/login";
      //window.location.reload(true);
    };

    function checkLogin() {
      if (!($localStorage.login)) {
        $state.go('login');
      } else {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        // $rootScope.changeCartNumber();
        // getMainCategories();
      }
    }

  })

  //---------------------------------- END -------------------------------------



  //----------------------------------------------------------------------------
  //-------------------------- OTHER-PAGES CONTROLLERS -------------------------


  .controller('MedDetailCtrl', function ($scope, $state, $ionicHistory) {
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.backView().go();
    };

    var currentNo = 1;
    $scope.quantity = currentNo;
    $scope.add = function () {
      currentNo++;
      $scope.quantity = currentNo;
    }

    $scope.sub = function () {
      if (currentNo <= 1) {
        return;
      }
      currentNo--;
      $scope.quantity = currentNo;
    }
    $scope.gotoCart = function () {
      $state.go('cart');
    }
    $scope.gobacktoHome = function () {
      $state.go('tab.home');
    }
    // $scope.range = function(count){
    //   for (var i = 0; i < count; i++) { 
    //     console.log("No. "+i);

    //   }
    // }
  })

  .controller('UpldPrescriptionCtrl', function ($scope, $state, $ionicHistory) {
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.goBack();
    };

    $scope.value = 'call';
    $scope.newValue = function (value) {
      console.log(value);
      $scope.value = value;
      console.log("***" + $scope.value);
    }
  })

  .controller('CartCtrl', function ($scope, $state, $ionicHistory) {
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.backView().go();
    }

    $scope.gotoOTCCheckout = function () {
      $state.go('checkout_otc');
    }

    var currentNo = 1;
    var currentNo2 = 1;

    var price = 49;
    var price2 = 75;

    $scope.price = price;
    $scope.price2 = price2;

    $scope.quantity = currentNo;
    $scope.quantity2 = currentNo2;

    $scope.add = function () {
      currentNo++;
      $scope.quantity = currentNo;
      $scope.price = currentNo * price;
    }

    $scope.sub = function () {
      if (currentNo <= 1) {
        return;
      }
      currentNo--;
      $scope.quantity = currentNo;
      $scope.price = currentNo * price;
    }

    $scope.add2 = function () {
      currentNo2++;
      $scope.quantity2 = currentNo2;
      $scope.price2 = currentNo2 * price2;
    }

    $scope.sub2 = function () {
      if (currentNo2 <= 1) {
        return;
      }
      currentNo2--;
      $scope.quantity2 = currentNo2;
      $scope.price2 = currentNo2 * price2;
    }

  })

  .controller('OTCSearchCtrl', function ($scope, $state, $ionicHistory) {
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.goBack();
    };

    $scope.search = {};

    var otc_list = ["pediasure", "crocin", "protinex", "similac", "dexolac", "nestum", "cererlac", "moov",
      "boroline", "volini", "sugar free", "suthol", "harpic", "revital", "calpol", "glucose"];

    $scope.search.suggestions = otc_list;

    $scope.$watch('search.otc', function (newValue) {

      if (newValue == '') {
        //$scope.clearFilter();
      }
      console.log("nw " + newValue);
      if (newValue) {
        // SearchHospitalNames.getHospitalNames(newValue).then(function (result) {
        //   if (result.data.status == 'success') {
        //     $scope.search.error = null;
        //     $scope.search.suggestions = result.data.data;
        //     $scope.search.error = false;
        //   } else if (result.data.status == 'error') {
        //     $scope.search.error = true;
        //   }
        // });
      }
      $scope.chooseListItem = function (otc) {
        //$ionicLoading.show();

        $state.go('medicine_details');

        // $scope.search.hospital = hospital;
        $scope.listShow = false;
        // $scope.Info.filter_hospital = hospital;
        // console.log($scope.Info);

      };
      $scope.showList = function () {
        $scope.listShow = true;
      };
    });
  })

  .controller('CheckoutOTCCtrl', function ($scope, $state, $ionicHistory) {
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.backView().go();
    };
  })

  .controller('CheckoutCtrl', function ($scope, $state, $ionicHistory) {
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.backView().go();
    };
  })

  .controller('PinValidationCtrl', function ($scope, $state, $ionicHistory) {
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.backView().go();
    };

    //$scope.navTitle='<img class="title-image" src="img/app_logo.png" />';
    $scope.gotoUpldPresc = function () {
      $state.go('upload_prescription');
    }
    // $scope.gotoOTCSearch = function () {
    //   $state.go('search_OTC');
    // }
  })

  .controller('PinValidationOTCCtrl', function ($scope, $state, $ionicHistory) {
    $scope.goBack = function () {
      console.log('Going back');
      $ionicHistory.backView().go();
    };

    //$scope.navTitle='<img class="title-image" src="img/app_logo.png" />';
    // $scope.gotoUpldPresc = function () {
    //   $state.go('upload_prescription');
    // }
    $scope.gotoOTCSearch = function () {
      $state.go('search_OTC');
    }
  });


//---------------------------------- END -------------------------------------