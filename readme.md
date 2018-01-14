#Social Feed Widget

Implement widget, which renders N last social posts from the given JSON feed into specified HTML element container. Widget should pull updates from the feed with the given interval and update displayed list by removing old items and displaying the new ones, so N the most recent posts will be displayed.

###Each post record should display:

- Post date (formatted as DD/MM/YYYY HH:MM) in user's timezone
- Author name
- Message body

###Widget should accept the following configuration options:

- Desination HTML element container
- Feed URL
- Number of posts to display
- Update interval

Widget should be implemented with plain (Vanilla) JS. jQuery usage will also be accepted. 

While implementing, think about loading and rendering performance, memory usage and leaks.

The following feed can be used as an example: http://api.massrelevance.com/MassRelDemo/kindle.json. It supports both CORS and JSONP. It also provides some Web API: http://dev.massrelevance.com/docs/api/v1.0/stream/#ref-params-standard

Together with sources, contestant should also report time he spent implementing this widget.