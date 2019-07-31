---
layout: null
---
{%- assign deps = 'jquery,domReady!' | split: ',' -%}
{%- if site.staticman.reCaptcha.siteKey -%}
	{%- assign deps = deps | push: 'recaptcha' -%}
{%- endif -%}

define ({{ deps | jsonify }}, function ($) {

	$('#staticman-form-wrapper').removeClass('hidden');

	$('#new_comment').submit(function () {
		var form = this;

		{% assign sm = site.staticman -%}
		var endpt = '{{ sm.endpoint | default: "https://staticman3.herokuapp.com/v3/entry/github/" }}'.replace(/\/$/, '');

		$.ajax({
			method: $(this).attr('method'),
			url: [ endpt, '{{sm.repository}}', '{{sm.branch}}', 'comments' ].join('/'),
			data: $(this).serialize(),
			success: function (data, status, jqXHR) {
				$('#staticman-form-wrapper *[type="submit"]').fadeOut();
				{%- if sm.reCaptcha.siteKey %}
				$('.g-recaptcha').fadeOut();
				{%- endif %}
				$('#staticman-notice-success').removeClass('hidden');
				$('#staticman-notice-failure').addClass('hidden');
			},
			error: function (jqXHR, status, error) {
				console.log('Error in form submission: ' + error);
				console.log(jqXHR);
				$('#staticman-notice-success').addClass('hidden');
				$('#staticman-notice-failure').removeClass('hidden');
			}
		});

		return false;
	});

});
