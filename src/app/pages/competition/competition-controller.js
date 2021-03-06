/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('UApps.pages.competition', [])
        .config(routeConfig).controller('competitionCtrl', competitionCtrl);

    function competitionCtrl($scope, CompetitionServices, $location, toastr) {

        $scope.format = "yyyy-MM-dd";
        $scope.competitionPageSize = 10;
        $scope.locations = new Array();

        /*var data = [{
           seq: 4, name: 'Mumbai'
        }];
        $scope.locations.push(data);*/


        $scope.gotoCreateCompetition = function () {
            $location.path("/createCompetition");
        };
        $scope.editCompetitionData = function (item) {
            $location.path("editCompetition/" + item.token);
        };

        $scope.newCompetition={
            form:{},
            info:{
                competitionName:"",
                startDate:"",
                endDate:"",
                commonDetailsVOList:[],
                timeLimit:""
            }
        };



        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.popup1 = {
            opened: false
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.popup2 = {
            opened: false
        };

        $scope.selected = {
            corporate: []
        };

        CompetitionServices.getcompanydetails().then(function (response) {
            $scope.companies = response.companydetails
            $scope.newCompetition.info.companyDetailsVO = new Array();
        });

        getCompetitionsList();
        function getCompetitionsList() {
            CompetitionServices.getList().then(function (response) {
                $scope.competitionMasterData = response.competitionList;
                $scope.competitionData = [].concat($scope.competitionMasterData);
            });
        }

        $scope.addCompetition = function (isValid) {
            if (isValid) {
                var data = $scope.newCompetition.info;
                console.log($scope.newCompetition.info.companyDetailsVO[0]);
                console.log(data);
                CompetitionServices.create(data).then(function (response) {
                   // angular.copy({}, $scope.newCompetition.info);
                    $scope.newCompetition.form.$setPristine();
                    $scope.newCompetition.info = "";
                    $location.path("/competition");
                    getCompetitionsList();
                    toastr.success("Competition created successfully");
                })
            }
        }

        $scope.companyChange = function(data, index) {
            var obj = {companySeq: data.seq};
            $scope.locations[index] = new Array();
            CompetitionServices.getCompanyLocations(obj).then(function(response) {
                $scope.locations[index] = response.companylocations;
            });
        }

        $scope.choices = [{id: 'choice1'}];

        $scope.addNewChoice = function() {
            var newItemNo = $scope.choices.length+1;
            $scope.choices.push({'id':'choice'+newItemNo});
        };

        $scope.removeChoice = function() {
            var lastItem = $scope.choices.length-1;
            $scope.choices.splice(lastItem);
        };
        /*CompetitionServices.getcompanydetails().then(function(response) {
            $scope.companies=response.companydetails
        });

        CompetitionServices.getList().then(function(response) {
            $scope.competitionData = response.competitionList;
        });*/

        /*$scope.addCompetition= function(isValid) {
            if(isValid) {
                var data = $scope.newCompetition.info;
                CompetitionServices.create(data).then(function(response) {
                    angular.copy({}, $scope.newCompetition.info);
                    toastr.success("Competition created successfully");
                })
            }
        }*/

    }


    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('competition', {
                url: '/competition',
                controller: competitionCtrl,
                templateUrl: 'app/pages/competition/competition-list.html',
                title: 'Competition',
                sidebarMeta: {
                    icon: 'fa fa-th-large fa-lg',
                    order: 4
                }
            })
            .state('createCompetition', {
                url: '/createCompetition',
                templateUrl: 'app/pages/competition/create-competition.html',
                controller: competitionCtrl,
                title: 'CREATE COMPETITION'
            })

    }

})();
