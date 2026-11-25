# Security Policy

## Supported versions

Security fixes are applied to the current production version of MXT Lab. Older deployments and unsupported branches may not receive security updates.

## Reporting a vulnerability

Please do not publish suspected vulnerabilities, student data, access tokens, screenshots containing personal information, or exploit details in public issues.

Use GitHub's **Report a vulnerability** feature in the repository Security tab to submit a private vulnerability report when it is available. If private reporting is unavailable, contact **mxtlab.png@gmail.com** and request a private channel before sharing technical details.

Include:
- The affected page, endpoint or component.
- A concise description of the security impact.
- Reproduction steps using test accounts and synthetic data.
- Sanitized evidence and any practical mitigation.
- The approximate time of the test and the browser/device used.

Do not include passwords, access tokens, service-role keys, student names, student records or other personal information in an initial report.

## Responsible testing

- Test only accounts and data you own or have explicit permission to use.
- Never access, alter, download or disclose another person's data.
- Do not perform denial-of-service tests, phishing, social engineering, destructive actions or bulk data extraction.
- Do not upload malware or attempt to access private files belonging to other users.
- Allow MXT Lab a reasonable opportunity to investigate and address a report before public disclosure.

## Scope

The supported production service is `https://mxtlab.online` and its official `www` redirect. Vulnerabilities in the MXT Lab website, authentication, student learning records, teacher tools, APIs and storage access controls are in scope.

Third-party services (including Google, Supabase, Vercel and advertising providers) should be reported through their own security channels where the issue is in their infrastructure.

## Student privacy

Do not include real student names, contact details, school identifiers, grades, learning records or uploaded documents in vulnerability reports. Use synthetic test data.

## Response

Reports will be acknowledged and investigated as soon as reasonably practical. A response or remediation timeline is not guaranteed. Please allow time for a fix and coordinated disclosure before publishing details. No bug-bounty payment is offered unless a separate programme is published.
