import html from "../utils/html.js";

/**
 * @type {import("react").FC}
 */
const Footer = () => {
  return html`
    <footer>
      <a
        href="https://github.com/Level222/443-paint"
        className="github-link"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src="./images/github-mark-white.svg"
          alt="github logo"
          className="github-logo"
        />
        Created by Level222
      </a>
    </footer>
  `;
};

export default Footer;
