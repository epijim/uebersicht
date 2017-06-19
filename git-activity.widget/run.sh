#! /bin/bash

if [ -f /usr/local/bin/node ]; then
	# If node is installed via Homebrew, use it
	/usr/local/bin/node ./git-activity.widget/src/generate.js
else
	# Fallback to normal
	node ./git-activity.widget/src/generate.js
fi
