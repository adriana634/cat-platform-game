const Input = {

    KEYCODE_MAP: {
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
        UP: 'ArrowUp'
    },

    KEY_STATES: {},

    init() {
        document.addEventListener('keydown', ({ key }) => { this.changeKey(key, 1) });
        document.addEventListener('keyup',   ({ key }) => { this.changeKey(key, 0) });
    },

    changeKey(key, value) {
        this.KEY_STATES[key] = value;
    },

    isPressed(key) {
        const keyUpperCased = key.toUpperCase();
        const keycode = this.KEYCODE_MAP[keyUpperCased];

        if (this.KEY_STATES[keycode] !== undefined) {
            return this.KEY_STATES[keycode];
        }
    }
};

export default Input;