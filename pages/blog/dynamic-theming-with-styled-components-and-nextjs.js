import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import {
  BlogArticleContainer,
  BlogSEO,
  BlogParagraph,
  BlogList,
  BlogSectionHeading,
  BlogCodeBlock,
  BlogLink,
  BlogQuote
} from 'components/Blog';
import { generatePageTheme } from 'components/AppTheme';
import Button from 'components/Button';
import colors from 'nice-color-palettes/500';
import bestContrast from 'get-best-contrast-color';
import getContrastRatio from 'get-contrast-ratio';

/**
 * Picks a random top-rated color palette from https://www.colourlovers.com/
 * to generate a page theme.
 *
 * https://github.com/Jam3/nice-color-palettes
 */
const generateColorPalette = () => {
  // Font and Highlight Font contrast must equal or exceed
  // this value against background color
  const CONTRAST_THRESHOLD = 3.4;

  let backgroundColor;
  let fontColor;
  let highlightFontColor;

  // Returns true if background-font contrast is above CONTRAST_THRESHOLD
  // otherwise false
  const goodBackgroundContrast = () => {
    if (
      getContrastRatio(backgroundColor, fontColor) >= CONTRAST_THRESHOLD &&
      getContrastRatio(backgroundColor, highlightFontColor) >=
        CONTRAST_THRESHOLD
    )
      return true;

    return false;
  };

  // Find color palette with good contrast
  do {
    // Choose random color palette
    const palette =
      colors[Math.floor(Math.random() * Math.floor(colors.length))];

    // Find good background/font colors within palette
    // eslint-disable-next-line no-restricted-syntax
    for (const currBackground of palette) {
      // Set theme colors based on current background of palette
      backgroundColor = currBackground;
      fontColor = bestContrast(currBackground, palette);
      highlightFontColor = bestContrast(
        currBackground,
        // eslint-disable-next-line no-loop-func
        palette.filter(color => color !== fontColor)
      );

      // Use current palette colors if they meet contrast threshold
      if (goodBackgroundContrast()) break;
    }
  } while (!goodBackgroundContrast());

  return generatePageTheme({
    fontColor,
    highlightFontColor,
    backgroundColor
  });
};

const BlogPage = ({ baseUrl, theme, updateTheme }) => (
  <>
    <BlogSEO baseUrl={baseUrl} />
    <ThemeProvider theme={theme}>
      <BlogArticleContainer>
        <BlogSectionHeading>
          <span role="img" aria-label="lit">
            🔥
          </span>{' '}
          Demo First{' '}
          <span role="img" aria-label="lit">
            🔥
          </span>{' '}
        </BlogSectionHeading>
        <BlogSectionHeading style={{ margin: 0, fontSize: '1.2em' }}>
          Choose a new page theme
        </BlogSectionHeading>
        <ToggleThemeContainer>
          <RainbowButton onClick={() => updateTheme(generateColorPalette())}>
            Random???
          </RainbowButton>
          <Button
            onClick={() =>
              updateTheme(
                generatePageTheme({
                  fontColor: 'black',
                  highlightFontColor: 'cyan',
                  backgroundColor: '#9e9e9e'
                })
              )
            }
          >
            Grey Theme
          </Button>

          <Button
            onClick={() =>
              updateTheme(
                generatePageTheme({
                  fontColor: '#31d7f9',
                  highlightFontColor: 'springgreen',
                  backgroundColor: '#202629'
                })
              )
            }
          >
            Blue Theme
          </Button>
          <Button
            onClick={() =>
              updateTheme(
                generatePageTheme({
                  fontColor: '#e2e5ec',
                  highlightFontColor: 'aquamarine',
                  backgroundColor: '#101010'
                })
              )
            }
          >
            Dark Theme
          </Button>
          <Button onClick={() => updateTheme({})}>Default</Button>
        </ToggleThemeContainer>
        <BlogQuote>
          Click that random button a few times, what is it doing?
        </BlogQuote>
        <BlogParagraph>
          When I go about building themable React apps, I usually have three
          concerns
        </BlogParagraph>
        <BlogList>
          <li>
            The entire app <i>has</i> a theme
          </li>
          <li>
            A page <i>can have</i> a theme
          </li>
          <li>
            The page or app theme can change <i>at runtime</i>
          </li>
        </BlogList>
        <BlogParagraph>
          Concerns #1 and #2 are what you see on this page right now. Clicking
          through the links of this blog, every page has it&apos;s own unique
          set of theme variables such as background and font colors, which
          optionally override the default app theme.
        </BlogParagraph>
        <BlogParagraph>
          The venerable CSS-in-JS library{' '}
          <BlogLink
            href="https://github.com/styled-components/styled-components"
            paragraph
          >
            <code>styled-components</code>
          </BlogLink>{' '}
          comes with a{' '}
          <BlogLink
            href="https://www.styled-components.com/docs/advanced#theming"
            paragraph
          >
            <code>{`<ThemeProvider theme={theme}/>`}</code>
          </BlogLink>{' '}
          component which uses React context to pass it&apos;s theme variables
          to any of it&apos;s child components.
        </BlogParagraph>
        <BlogParagraph>
          In a Next.js app, it&apos;s easy to apply this{' '}
          <code>ThemeProvider</code> to all pages by wrapping{' '}
          <code>{`<Component />`}</code> in{' '}
          <BlogLink href="https://nextjs.org/docs#custom-app" paragraph>
            <code>/pages/_app.js</code>
          </BlogLink>
          .
        </BlogParagraph>
        <BlogCodeBlock
          language="jsx"
          path="/pages/_app.js"
          code={`
render() {
  const { Component, pageProps } = this.props;
  const appTheme = {
    fontColor: 'black',
    backgroundColor: 'white'
  };

  return (
    <Container>
      <ThemeProvider theme={appTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Container>
  );
}
        `}
        />
        <BlogParagraph>
          Since all pages are now descendants of{' '}
          <code>{`<ThemeProvider />`}</code>, any component of these pages has
          easy access to <code>fontColor</code> and <code>backgroundColor</code>
          .
        </BlogParagraph>
        <BlogCodeBlock
          language="jsx"
          path="/pages/cool-page.js"
          code={`
import styled from 'styled-components';

const Page = () => (
  <StyledPage>
    I'm a themed page!
  </StyledPage>
);

export default Page;

const StyledPage = styled.div\`
  background-color: ${`{({ theme }) => theme.backgroundColor }`};
  color: ${`{({ theme }) => theme.fontColor }`};
\`;
        `}
        />
        <BlogQuote>
          The default app theme is cool but what about page themes?
        </BlogQuote>
        <BlogParagraph>
          In Next.js, static properties of a page can be accessed in{' '}
          <code>/pages/_app.js</code>. So let&apos;s add a static property to
          our <code>Page</code> called <code>pageTheme</code>
        </BlogParagraph>
        <BlogCodeBlock
          language="jsx"
          path="/pages/cool-page.js"
          code={`
import styled from 'styled-components';

const Page = () => (
  <StyledPage>
    I'm a themed page!
  </StyledPage>
);

Page.pageTheme = {
  backgroundColor: green;
  fontColor: purple;
};

export default Page;

const StyledPage = styled.div\`
  background-color: ${`{({ theme }) => theme.backgroundColor }`};
  color: ${`{({ theme }) => theme.fontColor }`};
\`;
        `}
        />
        <BlogParagraph>
          Then we&apos;ll merge our page theme variables into the default app
          theme.
        </BlogParagraph>
        <BlogCodeBlock
          language="jsx"
          path="/pages/_app.js"
          code={`
render() {
  const { Component, pageProps } = this.props;
  const { pageTheme } = Component;

  const theme = {
    // Default app theme
    ...appTheme,
    // Any theme variables provided by the page
    ...pageTheme
  };

  return (
    <Container>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Container>
  );
}
        `}
        />
        <BlogSectionHeading>The Dynamic Page Theme</BlogSectionHeading>
        <BlogQuote>Pfff... Light/Dark mode. I want it all!</BlogQuote>
        <BlogParagraph>
          In order to change our page theme dynamically, i.e. at the push of a
          button, we&apos;ll need to transcend our static page properties with
          actual state changes inside <code>/pages/_app.js</code>.
        </BlogParagraph>
        <BlogParagraph>
          The overall goal is to maintain state in <code>/pages/_app.js</code>{' '}
          with a list of pages and their dynamic page overrides. We&apos;ll then
          need to create a function for retrieving and updating the current
          page&apos;s dynamic theme variables. The <code>updateTheme()</code>{' '}
          function will be passed as a prop to our page which can be used to
          update the theme!
        </BlogParagraph>
        <BlogCodeBlock
          language="jsx"
          path="/pages/_app.js"
          code={`
/**
 * Maintain a list of dynamic theme variables for each page
 * 
 * dynamicPageThemes: [
 *    {
 *      route: '/cool-page',
 *      dynamicTheme: {
 *        backgroundColor: 'grey',
 *        fontColor: 'blue'
 *      }
 *    }
 * ]
 */
state = {
  dynamicPageThemes: []
};

/**
 * Updates the current page's theme with provided variables
 *
 * @param dynamicTheme object
 */
updateTheme = dynamicTheme => {
  // Get the current page route i.e. /cool-page
  const { route } = this.props.router;
  const { dynamicPageThemes } = this.state;

  // Lookup this page in state, create or update if necessary
  const pageIndex = dynamicPageThemes.findIndex(page => page.route === route);
  if (pageIndex === -1) dynamicPageThemes.push({ route, dynamicTheme });
  else dynamicPageThemes[pageIndex] = { route, dynamicTheme };

  // Add dynamic theme vars to state
  this.setState({ dynamicPageThemes });
};

/**
 * Retrieves any dynamic theme vars for current page
 *
 * @returns object
 */
getDynamicPageTheme = () => {
  // Get the current page route i.e. /cool-page
  const { route } = this.props.router;
  const { dynamicPageThemes } = this.state;

  // Lookup this page in state if it exists
  const dynamicPageTheme = dynamicPageThemes.find(
    pageTheme => pageTheme.route === route
  );

  // Return any dynamic theme variables for the current page route
  return dynamicPageTheme ? dynamicPageTheme.dynamicTheme : {};
};

render() {
  const { Component, pageProps } = this.props;
  const { pageTheme } = Component;
  const dynamicTheme = this.getDynamicPageTheme();

  const theme = {
    // Default app theme
    ...appTheme,
    // Any theme variables provided by the page
    ...pageTheme,
    // Override any static page variables with dynamically set variables
    ...dynamicTheme
  };

  return (
    <Container>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} updateTheme={this.updateTheme} />
      </ThemeProvider>
    </Container>
  );
}
        `}
        />
        <BlogParagraph>
          Since our theme that is passed to <code>ThemeProvider</code> is now a
          product of state changes, we can therefore dynamically update any page
          by calling <code>this.props.updateTheme()</code>
        </BlogParagraph>
        <BlogCodeBlock
          language="jsx"
          path="/pages/cool-page.js"
          code={`
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Page = ({ updateTheme }) => (
  <StyledPage>
    I'm a themed page!
    <button
      type="button"
      onClick={() =>
        updateTheme({ backgroundColor: 'magenta', fontColor: 'grey' })
      }
    >
      Grey Theme
    </button>
  </StyledPage>
);

Page.pageTheme = {
  backgroundColor: green;
  fontColor: purple;
};

BlogPage.propTypes = {
  updateTheme: PropTypes.func.isRequired
};

export default Page;

const StyledPage = styled.div\`
  background-color: ${`{({ theme }) => theme.backgroundColor }`};
  color: ${`{({ theme }) => theme.fontColor }`};
\`;
        `}
        />
        <BlogSectionHeading>The Random Button</BlogSectionHeading>
        <BlogParagraph>
          There is a treasure trove of cool color palettes over at{' '}
          <BlogLink href="https://www.colourlovers.com/palettes" paragraph>
            colourlovers.com
          </BlogLink>
          .
        </BlogParagraph>
        <BlogQuote>
          Most of these palettes, let alone the top several hundred, surely will
          look great in a page theme, right?
        </BlogQuote>
        <BlogParagraph>
          Conveniently, there is a library for exactly this purpose on npm!
        </BlogParagraph>
        <BlogParagraph>
          In order to automagically generate a complete page theme from random
          color palettes, there is only one hardfast rule. The contrast of the
          text to background must be high enough that the page is legible.
        </BlogParagraph>
        <BlogQuote>
          The Web Content Accessibility Guidelines (WCAG) suggest several
          minimum contrast ratios of font color to background color. I&apos;ll
          settle for minimum contrast of 4.5 as it produces some very
          interesting results.
        </BlogQuote>
        <BlogParagraph>The basic algorithm is:</BlogParagraph>
        <BlogList>
          <li>
            Choose a random{' '}
            <BlogLink href="https://www.colourlovers.com/palettes" paragraph>
              colourlovers.com
            </BlogLink>{' '}
            color palette
          </li>
          <li>Pick the first color in the pallete as the background color</li>
          <li>
            Find the top two highest contrast colors in the palette against the
            background color
          </li>
          <li>
            If these contrasts exceed our <code>CONTRAST_THRESHOLD</code>, then
            these colors will be used to update our theme
          </li>
          <li>
            If these contrasts DO NOT exceed our <code>CONTRAST_THRESHOLD</code>
            , set the next color in the palette as our background color and try
            again
          </li>
          <li>
            If we&apos;ve gone through our entire color palette and still
            haven&apos;t found a suitable combination to meet our{' '}
            <code>CONTRAST_THRESHOLD</code>, pick a new random palette and try
            again until we&apos;ve found something decent.
          </li>
        </BlogList>
        <BlogCodeBlock
          language="jsx"
          path="/pages/cool-page.js"
          code={`
import colors from 'nice-color-palettes/500';
import bestContrast from 'get-best-contrast-color';
import getContrastRatio from 'get-contrast-ratio';

/**
 * Picks a random top-rated color palette from https://www.colourlovers.com/
 * to generate a page theme.
 *
 * https://github.com/Jam3/nice-color-palettes
 */
const generateColorPalette = () => {
  // Font and Highlight Font contrast must equal or exceed
  // this value against background color
  const CONTRAST_THRESHOLD = 4.5;

  let backgroundColor;
  let fontColor;
  let highlightFontColor;

  // Returns true if background-font contrast is above CONTRAST_THRESHOLD
  // otherwise false
  const goodBackgroundContrast = () => {
    if (
      getContrastRatio(backgroundColor, fontColor) >= CONTRAST_THRESHOLD &&
      getContrastRatio(backgroundColor, highlightFontColor) >=
        CONTRAST_THRESHOLD
    )
      return true;

    return false;
  };

  // Find color palette with good contrast
  do {
    // Choose random color palette
    const palette =
      colors[Math.floor(Math.random() * Math.floor(colors.length))];

    // Find good background/font colors within palette
    // eslint-disable-next-line no-restricted-syntax
    for (const currBackground of palette) {
      // Set theme colors based on current background of palette
      backgroundColor = currBackground;
      fontColor = bestContrast(currBackground, palette);
      highlightFontColor = bestContrast(
        currBackground,
        // eslint-disable-next-line no-loop-func
        palette.filter(color => color !== fontColor)
      );

      // Use current palette colors if they meet contrast threshold
      if (goodBackgroundContrast()) break;
    }
  } while (!goodBackgroundContrast());

  return {
    fontColor,
    highlightFontColor,
    backgroundColor
  };
};
          `}
        />
        <BlogParagraph>
          Useage is as simple as calling <code>generateColorPalette()</code> and
          passing it&apos;s result to <code>updateTheme()</code>.
        </BlogParagraph>
        <BlogCodeBlock
          language="jsx"
          path="/pages/cool-page.js"
          code={`
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Page = ({ updateTheme }) => (
  <StyledPage>
    I'm a themed page!
    <button
      type="button"
      onClick={() => updateTheme(generateColorPalette())}
    >
      Grey Theme
    </button>
  </StyledPage>
);

Page.pageTheme = {
  backgroundColor: green;
  fontColor: purple;
};

BlogPage.propTypes = {
  updateTheme: PropTypes.func.isRequired
};

export default Page;

const StyledPage = styled.div\`
  background-color: ${`{({ theme }) => theme.backgroundColor }`};
  color: ${`{({ theme }) => theme.fontColor }`};
\`;    
        `}
        />
        <BlogParagraph>
          <BlogLink
            href="https://codesandbox.io/s/nextjs-dynamic-theming-ibw4p"
            paragraph
          >
            Check out the full demo on CodeSandbox
          </BlogLink>
        </BlogParagraph>
      </BlogArticleContainer>
    </ThemeProvider>
  </>
);

const fontColor = 'black';
const highlightFontColor = 'springgreen';
const backgroundColor = '#008000';

// _app.js level theme variable overrides
BlogPage.theme = {
  headerNavFontColor: fontColor,
  headerNavTextUnderlineColor: highlightFontColor,
  headerNavHoverFontColor: highlightFontColor,
  headerNavHamburgerIconColor: fontColor,
  pageBackgroundColor: backgroundColor,
  pageContentFontColor: fontColor,
  pageContentLinkHoverColor: highlightFontColor
};

BlogPage.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  theme: PropTypes.object,
  updateTheme: PropTypes.func.isRequired
};

BlogPage.defaultProps = {
  theme: {}
};

// Override default app theme for this page
BlogPage.pageTheme = generatePageTheme({
  fontColor: 'black',
  highlightFontColor: 'springgreen',
  backgroundColor: '#008000'
});

// Get absolute url of page
BlogPage.getInitialProps = async ({ req }) => {
  const hostname = req ? req.headers.host : window.location.hostname;
  const protocol = hostname.includes('localhost') ? 'http' : 'https';

  return { baseUrl: `${protocol}/${hostname}` };
};

export default BlogPage;

const ToggleThemeContainer = styled.div`
  border-radius: 8px;
  border-color: ${({ theme }) => theme.popoutMenuBorderColor};
  border-width: 2px;
  border-style: solid;
  padding: 2em;
  margin: 1em 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  > * {
    margin: 1em;
  }
`;

const RainbowButton = styled(Button)`
  border-image: linear-gradient(
    to bottom right,
    #b827fc 0%,
    #2c90fc 25%,
    #b8fd33 50%,
    #fec837 75%,
    #fd1892 100%
  );
  border-image-slice: 1;
  border-width: 3px;
`;
