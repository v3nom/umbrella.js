define(['src/umbrella'],function(Umbrella){
	describe('UmbrellaJS', function(){
		describe('open()', function(){
			it('should return true', function(){
				expect(Umbrella.open()).toBe(true);			
			});			
		});	
	});
});
