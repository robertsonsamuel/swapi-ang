
    var myapp = angular.module('myapp', ['ui.router']);
    

    myapp.config(function($stateProvider, $urlRouterProvider){

      $urlRouterProvider.otherwise('/planets');

      $stateProvider
        .state('planets', {
            url: '/planets',
            templateUrl: 'planets.html',
            controller: 'PlanetCtrl'
        })
        .state('resident', {
            url: '/resident/:id',
            templateUrl: 'resident.html',
            controller: 'ResidentCtrl'
        });
    });
   

myapp.controller('ResidentCtrl', function($scope, $http, $stateParams, charSVC) {
        $scope.newChar = parseInt($stateParams.id);
        if(charSVC.getChar($stateParams.id)){
            $scope.character = charSVC.getChar($stateParams.id);
        }else{
            $http.get('http://swapi.co/api/people/' + $stateParams.id + '/?format=json').then(resp => {
                charSVC.saveChar(resp.data, $stateParams.id);
                $scope.character = charSVC.getChar($stateParams.id);
            });
        }
});

myapp.controller('PlanetCtrl', function($scope, $http, planetSVC, charSVC) {
   
    if(planetSVC.getPlanets().length === 0){
        $http.get('http://swapi.co/api/planets/?format=json').then(resp => {
            planetSVC.PopPlanets(resp.data.results);
            $scope.planets = planetSVC.getPlanets();

        }).catch(err => {console.log(err);});
    }else{
        $scope.character = charSVC.allChar();
        $scope.planets = planetSVC.getPlanets();
    }
    
});


myapp.service('planetSVC', function (){
  var planets = [];
  this.PopPlanets = function (results){
    planets = results.map(planet => {
      planet.residents = planet.residents.map(resident => {
        var resident = { url: resident };
        resident.id = resident.url.match(/\d+/)[0];
        return resident;
      });
    return planet;
    });
  };
  this.getPlanets = function (){
    return planets;
  };
});


myapp.service('charSVC', function() {
    var characters = {};
    this.getChar = function (key) {
    return characters[key];     
    };
    this.saveChar = function (person, id) {
     var charID = id;
     characters[charID] = person;
    };
    this.allChar = function () {
        return characters;
    }; 
});

