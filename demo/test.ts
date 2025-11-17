import { spec } from '@cxl/spec';

export default spec('demo', s => {
	s.test('should load', a => {
		a.ok(spec);
	});
});
