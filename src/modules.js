import { MIR_SET_TITLE, MIR_TWIST_LOAD, MIR_PLAY_SHOW } from './constants';

export default (state = null, action) => {
	switch (action.type) {
		case MIR_SET_TITLE:
			return {
				...state,
				title: action.title
			};
		case MIR_TWIST_LOAD:
			return {
				...state,
				twist: action.twist
			};
		case MIR_PLAY_SHOW:
			return {
				...state,
				play: action.play
			};
		default:
			return state;
	}
};
