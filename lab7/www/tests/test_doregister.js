	describe('AppCtrl', function() {
    var controller, 
        fromTemplateUrlMock,
        ionicPopupMock,scope,
        ionicModal;
		

    // TODO: Load the App Module
    beforeEach(module('starter'));


    beforeEach(inject(function (_$rootScope_, _$controller_,$q) {
		deferredTurl = $q.defer();
		ionicModal = jasmine.createSpyObj('$ionicModal spy', ['show', 'hide']);
		function fakeTemplate() 
		{
			return { 
				then: function(modal){
					$scope.modal = modal;
				}
			}
		}
		$ionicModal = {
			fromTemplateUrl: jasmine.createSpy('$ionicModal.fromTemplateUrl').and.callFake(fakeTemplate)
		};


		ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

			scope = _$rootScope_.$new();

			controller = _$controller_('AppCtrl', {'$scope': scope, '$ionicModal':ionicModal,'$ionicPopup': ionicPopupMock });
			scope.doregister();

    }));

	
	describe('doregister', function() {
        it('should hide the modal on success', function () {
            
            expect(ionicModal.hide).toHaveBeenCalled();
			});
        
        it('if successful, should show a popup', function() {

                expect(ionicPopupMock.alert).toHaveBeenCalled();
            });
         it('if unsuccessful, should show a popup', function() {

			expect(ionicPopupMock.alert).toHaveBeenCalled();
            });
    });

});
