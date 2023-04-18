/* global hljs noframe Masonry eckoConfig imagesLoaded */

'use strict';

// HIGHLIGHTER

function syntaxHighlighterConfigure() {
    const codeElements = document.querySelectorAll('pre code');
    codeElements.forEach((element) => {
        hljs.highlightBlock(element);
    });
}

// GALLERY

function galleryConfigure() {
    const galleryImages = document.querySelectorAll('.kg-gallery-image img');
    galleryImages.forEach((image) => {
        const container = image.closest('.kg-gallery-image');
        const width = image.attributes.width.value;
        const height = image.attributes.height.value;
        const ratio = width / height;
        container.style.flex = `${ratio} 1 0%`;
    });
}

// COMMENTS

// eslint-disable-next-line no-unused-vars, camelcase
function disqus_config() {
    this.page.url = eckoConfig('ecko_theme_base', 'ghost_absolute_url');
    this.page.identifier = eckoConfig('ecko_theme_base', 'ghost_comment_id');
}

function commentsDisqusLoad() {
    const disqusID = eckoConfig('ecko_theme_config', 'comments_disqus_id');
    const d = document;
    const s = d.createElement('script');
    s.src = `https://${disqusID}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
}

function commentsLoad() {
    const commentsElement = document.querySelector('.comments');
    if (commentsElement) {
        const commentsTitleElement = document.querySelector('.comments__title');
        const commentsDisqusElement = document.querySelector('.comments__disqus');
        commentsTitleElement.style.display = 'none';
        commentsDisqusElement.style.display = 'block';
        commentsDisqusLoad();
    }
}

function commentsConfigure() {
    const commentsElement = document.querySelector('.comments');
    if (commentsElement && eckoConfig('ecko_theme_config', 'comments_disqus_id') && eckoConfig('ecko_theme_base', 'ghost_comment_id')) {
        commentsElement.style.display = 'block';
        if (eckoConfig('ecko_theme_config', 'comments_autoload') === 'true') {
            commentsLoad();
        }
    }
}

function commentsBind() {
    const commentsShowElements = document.querySelectorAll('.js-comments-show');
    if (commentsShowElements) {
        commentsShowElements.forEach((commentsShowElement) => {
            commentsShowElement.addEventListener('click', () => {
                commentsLoad();
            });
        });
    }
}

// POST AUTHORS

function postAuthorsConfigure() {
    const postAuthorsElement = document.querySelector('.post-footer__authors');
    if (postAuthorsElement) {
        const postAuthorsItemsElement = postAuthorsElement.querySelectorAll('a');
        if (postAuthorsItemsElement.length <= 1) {
            postAuthorsElement.parentNode.removeChild(postAuthorsElement);
        }
    }
}

// DRAWER

function drawerConfigure() {
    const drawerElement = document.querySelector('.drawer');
    if (drawerElement) {
        const drawerOverlayElement = drawerElement.querySelector('.drawer__overlay');
        const drawerSidebarElement = drawerElement.querySelector('.sidebar');
        drawerOverlayElement.addEventListener('wheel', (event) => {
            drawerSidebarElement.scrollBy(event.deltaX, event.deltaY);
        }, {
            capture: true,
            passive: true,
        });
    }
}

function drawerToggle() {
    if (!window.ecko_ivy_drawer_open || window.ecko_ivy_drawer_open !== true) {
        drawerOpen();
    } else {
        drawerClose();
    }
}

function drawerOpen() {
    const containerElement = document.querySelector('.container');
    const menuElement = document.querySelector('.menu');
    const drawerElement = document.querySelector('.drawer');
    const drawerSidebarElement = document.querySelector('.drawer__sidebar');
    const drawerFocusanbleElement = drawerSidebarElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    //const ghostPortalElement = document.querySelector('.gh-portal-triggerbtn-iframe');
    document.body.classList.add('body--no-scroll', 'body--drawer-active');
    containerElement?.classList.add('container--shift-left');
    menuElement?.classList.add('menu--shift-left');
    //ghostPortalElement?.classList.add('gh-portal-triggerbtn-iframe--shift-left');
    drawerElement?.classList.add('drawer--active');
    window.ecko_ivy_drawer_open = true;
    setTimeout(() => {
        if (drawerFocusanbleElement) {
            drawerFocusanbleElement.focus();
        }
    }, 100);
}

function drawerClose() {
    const containerElement = document.querySelector('.container');
    const menuElement = document.querySelector('.menu');
    const drawerElement = document.querySelector('.drawer');
    //const ghostPortalElement = document.querySelector('.gh-portal-triggerbtn-iframe');
    document.body.classList.remove('body--no-scroll', 'body--drawer-active');
    containerElement?.classList.remove('container--shift-left');
    menuElement?.classList.remove('menu--shift-left');
    //ghostPortalElement?.classList.remove('gh-portal-triggerbtn-iframe--shift-left');
    drawerElement?.classList.remove('drawer--active');
    window.ecko_ivy_drawer_open = false;
}

function drawerBind() {
    const drawerToggleElements = document.querySelectorAll('.js-drawer-toggle');
    const drawerCloseElements = document.querySelectorAll('.js-drawer-close');
    if (drawerToggleElements) {
        drawerToggleElements.forEach((drawerToggleElement) => {
            drawerToggleElement.addEventListener('click', drawerToggle);
        });
    }
    if (drawerCloseElements) {
        drawerCloseElements.forEach((drawerCloseElement) => {
            drawerCloseElement.addEventListener('click', drawerClose);
        });
    }
}

// NOFRAME

function reframeConfigure() {
    noframe('.post-content iframe', '.kg-embed-card');
}

// TABLE LABELS

function tableConfigure() {
    const tableElements = document.querySelectorAll('table');
    tableElements.forEach((tableElement) => {
        if (!tableElement.classList.contains('table--non-responsive')) {
            const tableRowElements = tableElement.querySelectorAll('tbody tr');
            const tableHeaderElements = tableElement.querySelectorAll('th');
            const tableHeaders = Array.from(tableHeaderElements);
            tableRowElements.forEach((tableRowElement) => {
                const tableDataElements = tableRowElement.querySelectorAll('td');
                const tableDatas = Array.from(tableDataElements);
                tableDatas.forEach((tableData, index) => {
                    const headerLabel = tableHeaders[index].innerHTML;
                    tableData.setAttribute('data-label', headerLabel);
                });
            });
        }
    });
}

// FEED SUBSCRIBE

function feedSubscribeBind() {
    const feedSubscribeFormElement = document.querySelector('.sub__form');
    if (feedSubscribeFormElement) {
        const observer = new MutationObserver(() => {
            window.ivyFeedMasonry.layout();
        });
        observer.observe(feedSubscribeFormElement, {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false,
        });
    }
}

// CONTENT BORDER

function contentBorderConfigure() {
    const postMainElement = document.querySelector('.post__main');
    const postSidebarElement = document.querySelector('.post__sidebar');
    if (postMainElement && postSidebarElement) {
        if (postMainElement.clientHeight > postSidebarElement.clientHeight) {
            postSidebarElement.classList.add('sidebar--short');
        } else {
            postMainElement.classList.add('post__main--short');
        }
    }
}

// MASONRY FEED

function masonryFeedConfigure() {
    const feedContentElement = document.querySelector('.feed__content');
    if (feedContentElement) {
        const feedMasonry = new Masonry(feedContentElement, {
            columnWidth: '.feed__item:not(.card--layout-double)',
            itemSelector: '.feed__item',
            transitionDuration: 0,
        });
        window.ivyFeedMasonry = feedMasonry;
        imagesLoaded(feedContentElement, () => {
            feedMasonry.layout();
        });
    }
}

// AJAX FEED

class IvyAjaxFeed {

    init() {
        if (eckoConfig('ecko_theme_config', 'pagination_infinite') === 'true' && document.querySelector('.feed')) {
            this.paginationElement = document.querySelector('.pagination');
            this.paginationAjaxElement = this.paginationElement.querySelector('.pagination__ajax');
            this.paginationStandardElement = this.paginationElement.querySelector('.pagination__standard');
            this.paginationStandardNextElement = this.paginationElement.querySelector('.pagination__button--older');
            this.paginationLoadMoreElement = this.paginationElement.querySelector('.pagination__button--load-more');
            this.paginationLoadMoreLabelElement = this.paginationLoadMoreElement.querySelector('.pagination__label');
            this.feedContentElement = document.querySelector('.feed__content');
            this.paginationObserver = null;
            this.paginationAjaxElement.classList.add('pagination__ajax--enabled');
            this.paginationStandardElement.classList.add('pagination__standard--disabled');
            this.pagesLoaded = 0;
            this.lastFetched = null;
            this.bindEvents();
        }
    }

    bindEvents() {
        const paginationObserverOptions = {
            rootMargin: '0px',
            threshold: 1.0,
        };
        this.paginationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if ((Date.now() - this.lastFetch) > 4000 || !this.lastFetch) {
                        this.getNextPosts();
                    }
                }
            });
        }, paginationObserverOptions);
        this.paginationObserver.observe(this.paginationElement);
        this.paginationLoadMoreElement.addEventListener('click', () => {
            this.getNextPosts();
        });
        window.onpopstate = () => {
            window.history.go(-1);
        };
    }

    getNextPosts() {
        let nextPageURL = this.paginationStandardNextElement.getAttribute('href');
        if (nextPageURL && nextPageURL !== '#') {
            nextPageURL = `${eckoConfig('ecko_theme_base', 'ghost_site_url')}${nextPageURL}`;
            this.setButtonState('loading');
            fetch(nextPageURL)
                .then((response) => {
                    if (response.status !== 200) return false;
                    return response.text();
                }).then((html) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const postElements = doc.querySelectorAll('.card');
                    const newPaginationStandardElement = doc.querySelector('.pagination__standard');
                    if (postElements.length) {
                        this.lastFetch = Date.now();
                        window.history.pushState({}, '', nextPageURL);
                        this.appendPosts(postElements);
                        this.replacePagination(newPaginationStandardElement);
                    }
                });
        } else {
            this.setButtonState('disabled');
        }
    }

    setButtonState(state) {
        if (state === 'fetch') {
            this.paginationLoadMoreElement.classList.remove('pagination__button--loading');
            this.paginationLoadMoreElement.classList.add('pagination__button--fetch');
            this.paginationLoadMoreLabelElement.innerHTML = this.paginationLoadMoreElement.getAttribute('data-string-fetch-more-articles');
        } else if (state === 'loading') {
            this.paginationLoadMoreElement.classList.remove('pagination__button--fetch');
            this.paginationLoadMoreElement.classList.add('pagination__button--loading');
            this.paginationLoadMoreLabelElement.innerHTML = this.paginationLoadMoreElement.getAttribute('data-string-loading-more-articles');
        } else if (state === 'disabled') {
            this.paginationLoadMoreElement.classList.add('pagination__button--disabled');
            this.paginationLoadMoreLabelElement.innerHTML = this.paginationLoadMoreElement.getAttribute('data-string-no-more-articles');
        }
    }

    replacePagination(newPaginationStandardElement) {
        newPaginationStandardElement.classList.add('pagination__standard--disabled');
        this.paginationStandardElement.parentNode.replaceChild(
            newPaginationStandardElement,
            this.paginationStandardElement,
        );
        this.paginationStandardElement = this.paginationElement.querySelector('.pagination__standard');
        this.paginationStandardNextElement = this.paginationElement.querySelector('.pagination__button--older');
        const nextPageURL = this.paginationStandardNextElement.getAttribute('href');
        if (!nextPageURL || nextPageURL === '#') {
            this.setButtonState('disabled');
            this.paginationObserver.disconnect();
        } else {
            this.setButtonState('fetch');
        }
    }

    appendPosts(posts) {
        if (posts) {
            posts.forEach((post) => {
                post.classList.add('card--unloaded');
                this.feedContentElement.append(post);
            });
            window.ivyFeedMasonry.appended(posts);
            imagesLoaded(this.feedContentElement, () => {
                window.ivyFeedMasonry.layout();
                posts.forEach((post, index) => {
                    setTimeout(() => {
                        post.classList.remove('card--unloaded');
                    }, index * 125);
                });
            });
        }
    }

}

// INITIALIZE

function initLoad() {
    // Configurations
    syntaxHighlighterConfigure();
    commentsConfigure();
    galleryConfigure();
    postAuthorsConfigure();
    drawerConfigure();
    reframeConfigure();
    tableConfigure();
    contentBorderConfigure();
    masonryFeedConfigure();
    const ivyAjaxFeed = new IvyAjaxFeed();
    ivyAjaxFeed.init();
    // Binds
    commentsBind();
    drawerBind();
    feedSubscribeBind();
}

initLoad();
