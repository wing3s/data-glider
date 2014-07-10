app.controller('slider-controller', function($scope, UpdateFreqService, RangeService) {
    $scope.updateFreqSlider = {
        value: UpdateFreqService.getIndex(),
        min: 0,
        max: UpdateFreqService.getLen() - 1,
        translate: function(index) {
            return UpdateFreqService.getVal(index) + ' mins';
        }
    };

    $scope.rangeSlider = {
        value: RangeService.getIndex(),
        min: 0,
        max: RangeService.getLen() - 1,
        translate: function(index) {
            return RangeService.getVal(index);
        }
    };

    $scope.$on('slideEnded', function() {
        UpdateFreqService.setIndex($scope.updateFreqSlider.value);
        RangeService.setIndex($scope.rangeSlider.value);
    });
});