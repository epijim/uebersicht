command: `./git-activity.widget/run.sh`,
refreshFrequency: 3600000,
style: "\
#github-activity {\
  position: absolute;\
  left: 22%;\
  bottom: 30px;\
  transform: translateX(-50%) translateY(-50%);\
}",
render: () => {
	return "<style>#git-activity-widget-index-js { width: 100%; height: 100%; }</style>";
},
update: (output, domEl) => {
	domEl.innerHTML += output;
}
