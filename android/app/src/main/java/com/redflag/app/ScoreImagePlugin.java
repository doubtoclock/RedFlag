package com.redflag.app;

import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;

/** Stores the generated score-card PNG in the app cache so Android can share it securely. */
@CapacitorPlugin(name = "ScoreImage")
public class ScoreImagePlugin extends Plugin {
    @PluginMethod
    public void save(PluginCall call) {
        String base64 = call.getString("base64");
        if (base64 == null || base64.isEmpty()) {
            call.reject("Missing score image data");
            return;
        }

        try {
            File shareDirectory = new File(getContext().getCacheDir(), "shared_scores");
            if (!shareDirectory.exists() && !shareDirectory.mkdirs()) {
                call.reject("Couldn't create the score image directory");
                return;
            }

            File image = new File(shareDirectory, "red-flag-score.png");
            try (FileOutputStream output = new FileOutputStream(image, false)) {
                output.write(Base64.decode(base64, Base64.DEFAULT));
            }

            JSObject result = new JSObject();
            result.put("uri", image.toURI().toString());
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Couldn't save the score image", error);
        }
    }
}
