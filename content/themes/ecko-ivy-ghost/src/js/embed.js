/* global */

'use strict';

// CONFIG
// eslint-disable-next-line no-unused-vars, camelcase
window.ecko_theme_base = {
    ghost_post_title: '{{post.title}}',
    ghost_site_url: '{{@site.url}}',
    ghost_absolute_url: '{{url absolute="true"}}',
    ghost_comment_id: '{{post.comment_id}}',
};

// eslint-disable-next-line no-unused-vars, camelcase
window.ecko_theme_config = {
    theme: '{{@custom.theme}}',
    pagination_infinite: '{{@custom.pagination_infinite}}',
    comments_disqus_id: '{{@custom.comments_disqus_id}}',
    comments_autoload: '{{@custom.comments_autoload}}',
};

function eckoConfig(config, item) {
    if (
        typeof window[config] !== 'undefined'
        && window[config]
        && Object.prototype.hasOwnProperty.call(window[config], item)
        && window[config][item] !== ''
    ) {
        return window[config][item];
    }
    return false;
}

// ACCENT COLOR

function hexToHSL(hex, lightadjust = 0) {
    let r = 0;
    let g = 0;
    let b = 0;
    if (hex.length === 4) {
        r = `0x${hex[1]}${hex[1]}`;
        g = `0x${hex[2]}${hex[2]}`;
        b = `0x${hex[3]}${hex[3]}`;
    } else if (hex.length === 7) {
        r = `0x${hex[1]}${hex[2]}`;
        g = `0x${hex[3]}${hex[4]}`;
        b = `0x${hex[5]}${hex[6]}`;
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;
    if (delta === 0) {
        h = 0;
    } else if (cmax === r) {
        h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    l += lightadjust;
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function accentColorsConfigure() {
    const rootElement = document.documentElement;
    let accentColor = getComputedStyle(rootElement).getPropertyValue('--ghost-accent-color');
    if (accentColor) {
        accentColor = accentColor.trim();
        rootElement.style.setProperty('--color-accent-lighter', hexToHSL(accentColor, 45));
        rootElement.style.setProperty('--color-accent-light', hexToHSL(accentColor, 10));
        rootElement.style.setProperty('--color-accent', hexToHSL(accentColor));
        rootElement.style.setProperty('--color-accent-dark', hexToHSL(accentColor, -10));
        rootElement.style.setProperty('--color-accent-darker', hexToHSL(accentColor, -20));
    }
}

// THEME

function themeConfigure() {
    const userTheme = localStorage.getItem('ecko-theme-appearance');
    const themeOveride = new URLSearchParams(window.location.search).get('theme');
    if (themeOveride) {
        themeChange(themeOveride, true);
    } else if (userTheme === 'Light' || userTheme === 'Dark') {
        themeChange(userTheme);
    } else {
        const defaultTheme = eckoConfig('ecko_theme_config', 'theme');
        if (defaultTheme === 'User System Preference') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                themeChange('Dark');
            } else {
                themeChange('Light');
            }
        } else if (defaultTheme === 'Dark') {
            themeChange('Dark');
        } else {
            themeChange('Light');
        }
    }
}

function themeBind() {
    const themeSwitchElements = document.querySelectorAll('.js-theme-switch');
    if (themeSwitchElements) {
        themeSwitchElements.forEach((themeSwitchElement) => {
            themeSwitchElement.addEventListener('click', themeToggle);
        });
    }
}

function themeToggle() {
    if (document.documentElement.classList.contains('theme--dark')) {
        themeChange('Light', true);
    } else {
        themeChange('Dark', true);
    }
}

function themeChange(theme = 'Light', userInvoked = false) {
    if (userInvoked) {
        document.documentElement.classList.add('theme--switching');
        setTimeout(() => {
            document.documentElement.classList.remove('theme--switching');
        }, 600);
    }
    if (theme === 'Dark') {
        document.documentElement.classList.add('theme--dark');
        if (userInvoked) localStorage.setItem('ecko-theme-appearance', 'Dark');
    } else {
        document.documentElement.classList.remove('theme--dark');
        if (userInvoked) localStorage.setItem('ecko-theme-appearance', 'Light');
    }
}

// INITIALIZE

themeConfigure();
accentColorsConfigure();

window.addEventListener('DOMContentLoaded', () => {
    themeBind();
});
