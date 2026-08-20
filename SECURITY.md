# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.2.x   | Yes       |
| 0.1.x   | Best effort |

## Reporting a vulnerability

This skill generates static HTML from JSON you control. Still: if you find a
script-injection path in `inject-lesson.mjs` or XSS in `templates/lesson.html`
(lesson JSON is interpolated into a script tag), **do not** open a public issue
with a working exploit.

Use GitHub **Security advisories** on the repository, or email the maintainer
listed in the GitHub profile.

Expected response: acknowledgement within 7 days; a patch or a documented
wontfix for the latest minor line.
