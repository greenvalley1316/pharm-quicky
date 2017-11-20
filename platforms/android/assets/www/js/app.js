// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngStorage', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, $ionicHistory, $state, $ionicPopup) {
  
  $ionicPlatform.registerBackButtonAction(function (event) {
    if ($state.current.name == "login" || $state.current.name == "tab.home" || $state.current.name == "tab.orders"
                    || $state.current.name == "tab.notifications" || $state.current.name == "tab.myprofile") {
      $ionicPopup.confirm({
        title: 'Are You Want Exit',
        cancelText: 'No',
        okText: 'Yes',
      }).then(function (res) {
        if (res) {
          //                            $state.go('tab.logout');
          navigator.app.exitApp();
        }
      })
    } else {
                          //navigator.app.exitApp();
                          navigator.app.backHistory();
    }
  }, 100);

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.parentPageClickedButton = '';
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  $ionicConfigProvider.scrolling.jsScrolling(false); // For smooth scrolling

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  //--------------------- TABBED STATE ROUTE --------------------

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'tabsCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeTabCtrl'
      }
    }
  })

  .state('tab.orders', {
    url: '/orders',
    views: {
      'tab-orders': {
        templateUrl: 'templates/tab-orders.html',
        controller: 'OrdersTabCtrl'
      }
    }
  })

  .state('tab.notifications', {
    url: '/notifications',
    views: {
      'tab-notifications': {
        templateUrl: 'templates/tab-notifications.html',
        controller: 'NotificationsTabCtrl'
      }
    }
  })

  .state('tab.myprofile', {
    url: '/myprofile',
    views: {
      'tab-myprofile': {
        templateUrl: 'templates/tab-myprofile.html',
        controller: 'MyprofileTabCtrl'
      }
    }
  })
  


  // -------------------- NON TABBED STATE ROUTE -----------------------

  .state('login', {
    url: '/login',    
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'    
  })
  
  .state('otp', {
    url: '/otp',    
        templateUrl: 'templates/otp.html',
        controller: 'OtpCtrl'    
  })

  .state('forgotpassword_otp', {
    url: '/forgotpassword_otp',    
        templateUrl: 'templates/otp-forgot-pw.html',
        controller: 'OtpForgotPwCtrl'    
  })

  .state('registration', {
    url: '/registration',    
        templateUrl: 'templates/registration.html',
        controller: 'RegisterCtrl'    
  })

  .state('forgotpassword', {
    url: '/forgotpassword',    
        templateUrl: 'templates/forgotpassword.html',
        controller: 'ForgotPassCtrl'    
  })

  // .state('change_password', {
  //   url: '/change_password',    
  //       templateUrl: 'templates/change-password.html',
  //       controller: 'ChangePassCtrl'    
  // })

  .state('pinvalidation', {
    url: '/pinvalidation',    
        templateUrl: 'templates/pin-validation.html',
        controller: 'PinValidationCtrl'    
  })

  .state('pinvalidation_otc', {
    url: '/pinvalidation_otc',    
        templateUrl: 'templates/pin-validation-otc.html',
        controller: 'PinValidationOTCCtrl'    
  })

  .state('search_OTC', {
    url: '/search_OTC',    
        templateUrl: 'templates/otc-search.html',
        controller: 'OTCSearchCtrl'    
  })

  .state('medicine_details', {
    url: '/medicine_details',    
        templateUrl: 'templates/medicine-details.html',
        controller: 'MedDetailCtrl'    
  })

  .state('upload_prescription', {
    url: '/upload_prescription',    
        templateUrl: 'templates/upload-prescription.html',
        controller: 'UpldPrescriptionCtrl'    
  })

  .state('cart', {
    url: '/cart',    
        templateUrl: 'templates/cart.html',
        controller: 'CartCtrl'    
  })

  .state('checkout_otc', {
    url: '/checkout_otc',    
        templateUrl: 'templates/checkout-otc.html',
        controller: 'CheckoutOTCCtrl'    
  })

  .state('checkout', {
    url: '/checkout',    
        templateUrl: 'templates/checkout.html',
        controller: 'CheckoutCtrl'    
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
