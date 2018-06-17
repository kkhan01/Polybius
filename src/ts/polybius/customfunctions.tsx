import * as React from "react";

customfunction.addDynamicFilter = function(functionBody: string) {
			      const filter = new Function("download", functionBody);
			      const returnValue = filter("test.pdf"); // to catch errors
			      if (typeof returnValue !== "boolean") {
			      	 throw new Error("Return value of custom filter function must be a boolean: " + filter);
				 }
				 return customfunction.addFilter(filter);
				 };