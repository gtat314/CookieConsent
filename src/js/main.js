/**
 * 
 * @param {Object}                   schema
 * @param {Boolean}                  schema.htmlReady
 * @param {HTMLElement|CSSRule}      schema.parent
 * @param {HTMLSourceElement}        schema.title
 * @param {String}                   schema.acceptText
 * @param {String}                   schema.declineText
 * @param {String}                   schema.policyText
 * @param {URL}                      schema.policyLink
 * @param {String}                  [schema.googleCode]
 * @param {String}                  [schema.googleOptout]
 */
function CookieConsent( schema ) {

    /**
     * 
     * @property
     * @private
     * @var HTMLElement
     */
    this._parentElem = null;

    /**
     * 
     * @property
     * @private
     * @type {String|null}
     */
    this._googleCode = null;

    /**
     * 
     * @property
     * @private
     * @type {String|null}
     */
    this._googleOptOut = null;




    if ( typeof schema.parent === 'object' ) {

        this._parentElem = schema.parent;

    } else if ( typeof schema.parent === 'string' ) {

        this._parentElem = document.querySelector( schema.parent );

    }

    if ( schema.hasOwnProperty( 'googleCode' ) ) {

        this._googleCode = schema.googleCode;

    }

    if ( schema.hasOwnProperty( 'googleOptout' ) ) {

        this._googleOptOut = schema.googleOptout;

    }

    var cookie = document.cookie.split( '; ' ).find( function( element ){
        
        return element.startsWith( 'cookie_consent_status=' ); 
    
    });

    if ( typeof cookie !== 'undefined' ) {

        var cookieResponse = cookie.split( '=' )[ 1 ];

        if ( cookieResponse === 'allow' ) {

            if ( this._googleCode !== null ) {

                this._clbk_googleAnalytics();

            } else if ( this._googleOptOut !== null ) {

                this._clbk_googleAnalyticsOptout();
    
            }

        }

        setTimeout(function(){

            this._parentElem.style.display = 'none';
    
        }.bind( this ), 600);

        return false;

    } else {

        if ( this._googleOptOut !== null ) {

            this._clbk_googleAnalyticsOptout();

        }

    }

    if ( schema.hasOwnProperty( 'htmlReady' ) && schema.htmlReady === true ) {

        this._createFromHTML();

    } else {

        this._createFromSchema( schema );

    }

    window.addEventListener( 'load', this._evt_load_window.bind( this ) );

};




/**
 * 
 * @method
 * @private
 */
CookieConsent.prototype._createFromHTML = function() {

    this._parentElem.setAttribute( 'role', 'dialog' );
    this._parentElem.setAttribute( 'aria-live', 'polite' );
    this._parentElem.setAttribute( 'aria-label', 'cookieconsent' );
    this._parentElem.setAttribute( 'aria-describedby', 'cookieconsent:desc' );

    this._parentElem.querySelector( '.mod_acceptLink' ).addEventListener( 'click', this._evt_click_accept.bind( this ) );
    this._parentElem.querySelector( '.mod_declineLink' ).addEventListener( 'click', this._evt_click_decline.bind( this ) );

};

/**
 * 
 * @method
 * @private
 * @param {Object}                   schema
 * @param {Boolean}                  schema.htmlReady
 * @param {HTMLElement|CSSRule}      schema.parent
 * @param {HTMLSourceElement}        schema.title
 * @param {String}                   schema.acceptText
 * @param {String}                   schema.declineText
 * @param {String}                   schema.policyText
 * @param {URL}                      schema.policyLink
 * @param {String}                  [schema.googleCode]
 */
CookieConsent.prototype._createFromSchema = function( schema ) {

    this._parentElem.setAttribute( 'role', 'dialog' );
    this._parentElem.setAttribute( 'aria-live', 'polite' );
    this._parentElem.setAttribute( 'aria-label', 'cookieconsent' );
    this._parentElem.setAttribute( 'aria-describedby', 'cookieconsent:desc' );

    var fragment = document.createDocumentFragment();

    var pElem = document.createElement( 'P' );
    pElem.classList.add( 'text' );
    pElem.setAttribute( 'id', 'cookieconsent:desc' );
    pElem.setAttribute( 'role', 'complementary' );
    pElem.setAttribute( 'aria-label', 'cookie information' );
    fragment.appendChild( pElem );

    var spanElem = document.createElement( 'SPAN' );
    spanElem.innerHTML = schema.title;
    pElem.appendChild( spanElem );

    if ( schema.policyText !== "" && schema.policyLink !== "" ) {

        var aElem = document.createElement( 'A' );
        aElem.textContent = schema.policyText;
        aElem.setAttribute( 'aria-label', schema.policyText );
        aElem.setAttribute( 'title', schema.policyText );
        aElem.setAttribute( 'role', 'button' );
        aElem.setAttribute( 'tabindex', '0' );
        aElem.setAttribute( 'href', schema.policyLink );
        pElem.appendChild( aElem );

    }

    var compliance = document.createElement( 'DIV' );
    compliance.classList.add( 'compliance' );
    fragment.appendChild( compliance );

    var declineElem = document.createElement( 'A' );
    declineElem.classList.add( 'mod_declineLink' );
    declineElem.textContent = schema.declineText;
    declineElem.setAttribute( 'aria-label', schema.declineText );
    declineElem.setAttribute( 'title', schema.declineText );
    declineElem.setAttribute( 'role', 'button' );
    declineElem.setAttribute( 'tabindex', '0' );
    compliance.appendChild( declineElem );

    var acceptElem = document.createElement( 'A' );
    acceptElem.classList.add( 'mod_acceptLink' );
    acceptElem.textContent = schema.acceptText;
    acceptElem.setAttribute( 'aria-label', schema.acceptText );
    acceptElem.setAttribute( 'title', schema.acceptText );
    acceptElem.setAttribute( 'role', 'button' );
    acceptElem.setAttribute( 'tabindex', '0' );
    compliance.appendChild( acceptElem );

    acceptElem.addEventListener( 'click', this._evt_click_accept.bind( this ) );
    declineElem.addEventListener( 'click', this._evt_click_decline.bind( this ) );

    this._parentElem.appendChild( fragment );

};

/**
 * 
 * @private
 * @method
 */
CookieConsent.prototype._clbk_fadeOut = function() {

    this._parentElem.classList.remove( 'active' );

    setTimeout(function(){

        this._parentElem.style.display = 'none';

    }.bind( this ), 600);

};

/**
 * 
 * @private
 * @method
 */
CookieConsent.prototype._clbk_googleAnalytics = function() {

    var googleScript = document.createElement( 'script' );
    googleScript.setAttribute( 'src', 'https://www.googletagmanager.com/gtag/js?id=' + this._googleCode );
    googleScript.setAttribute( 'async', true );
    document.body.appendChild( googleScript );

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', this._googleCode);

};

CookieConsent.prototype._clbk_googleAnalyticsOptout = function() {

    var googleScript = document.createElement( 'script' );
    googleScript.setAttribute( 'src', 'https://www.googletagmanager.com/gtag/js?id=' + this._googleOptOut );
    googleScript.setAttribute( 'async', true );
    document.body.appendChild( googleScript );

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', this._googleOptOut);

};

/**
 * 
 * @private
 * @method
 */
CookieConsent.prototype._evt_load_window = function() {

    setTimeout( function(){

        this._parentElem.classList.add( 'active' );

    }.bind( this ), 150 );

};

/**
 * 
 * @private
 * @method
 */
CookieConsent.prototype._evt_click_accept = function() {

    this._clbk_fadeOut();

    var date = new Date;
    date.setDate( date.getDate() + 365 );

    document.cookie = "cookie_consent_status=allow; expires=" + date.toUTCString() + '; path=/; secure; SameSite=Strict';

    if ( this._googleCode !== null ) {

        this._clbk_googleAnalytics();

    }

};

/**
 * 
 * @private
 * @method
 */
CookieConsent.prototype._evt_click_decline = function() {

    this._clbk_fadeOut();

    var date = new Date;
    date.setDate( date.getDate() + 365 );

    document.cookie = "cookie_consent_status=deny; expires=" + date.toUTCString() + '; path=/; secure; SameSite=Strict';

};