command: `./github-activity.widget/run.sh`,
refreshFrequency: 360000,
style: "\
#githubhub-activity {\
  position: absolute;\
  left: 22%;\
  bottom: 150px;\
  transform: translateX(-50%) translateY(-50%);\
}",
render: () => {
	return "<style>#github-activity-widget-index-js { width: 100%; height: 100%; }</style>";
},
update: (output, domEl) => {
	domEl.innerHTML += output;
}
