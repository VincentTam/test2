---
layout: null
---
{%- assign deps = 'jquery,domReady!' | split: ',' -%}
{%- assign sm = site.staticman -%}
{%- if sm.reCaptcha.siteKey -%}
	{%- assign deps = deps | push: 'recaptcha' -%}
{%- endif -%}

define ({{ deps | jsonify }}, function ($) {

	$('#staticman-form-wrapper').removeClass('hidden');

	$('#staticman-submit-btn').click( function() {
		$('#staticman-notice-failure').addClass('hidden');
	});

	$('#new_comment').submit(function () {
		var endpt = '{{ sm.endpoint | default: "https://staticman3.herokuapp.com/v3/entry/github/" }}'.replace(/\/$/, '');

		$.ajax({
			method: $(this).attr('method'),
			url: [ endpt, '{{sm.repository}}', '{{sm.branch}}', 'comments' ].join('/'),
			data: $(this).serialize(),
			success: function (data, status, jqXHR) {
				$('#staticman-submit-btn').fadeOut();
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
				if (jqXHR.responseJSON.message) {
					$('#staticman-ajax-error').html(jqXHR.responseJSON.message);
				} else if (jqXHR.responseJSON.rawError.message) {
					$('#staticman-ajax-error').html(jqXHR.responseJSON.rawError.message);
				} else {
					$('#staticman-ajax-error').html(error);
				};
			}
		});

		return false;
	});

});
