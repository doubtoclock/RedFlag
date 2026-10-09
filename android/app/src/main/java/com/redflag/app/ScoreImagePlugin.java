package com.redflag.app;

import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

/** Stores the generated score-card PNG in the app cache so Android can share it securely. */
@CapacitorPlugin(name = "ScoreImage")
public class ScoreImagePlugin extends Plugin {
    // The generated 1080x1920 PNG is expected to be well below this limit.
    private static final int MAX_BASE64_LENGTH = 16 * 1024 * 1024;
    private static final int MAX_IMAGE_BYTES = 12 * 1024 * 1024;
    private static final long MAX_IMAGE_AGE_MILLIS = 24L * 60L * 60L * 1000L;
    private static final String SCORE_IMAGE_PREFIX = "red-flag-score-";
    private static final String SCORE_IMAGE_SUFFIX = ".png";
    private static final byte[] PNG_SIGNATURE = new byte[] {
        (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    };

    @PluginMethod
    public void save(PluginCall call) {
        String base64 = call.getString("base64");
        if (base64 == null || base64.isEmpty()) {
            call.reject("Missing score image data");
            return;
        }
        if (base64.length() > MAX_BASE64_LENGTH) {
            call.reject("Score image is too large");
            return;
        }

        try {
            File shareDirectory = new File(getContext().getCacheDir(), "shared_scores");
            if (!shareDirectory.exists() && !shareDirectory.mkdirs()) {
                call.reject("Couldn't create the score image directory");
                return;
            }

            byte[] imageBytes;
            try {
                imageBytes = Base64.decode(base64, Base64.DEFAULT);
            } catch (IllegalArgumentException error) {
                call.reject("Score image data is invalid");
                return;
            }

            if (imageBytes.length == 0 || imageBytes.length > MAX_IMAGE_BYTES || !isPng(imageBytes)) {
                call.reject("Score image data is invalid");
                return;
            }

            deleteExpiredImages(shareDirectory);

            File image = new File(shareDirectory, SCORE_IMAGE_PREFIX + UUID.randomUUID() + SCORE_IMAGE_SUFFIX);
            try (FileOutputStream output = new FileOutputStream(image, false)) {
                output.write(imageBytes);
            }

            JSObject result = new JSObject();
            result.put("uri", image.toURI().toString());
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Couldn't save the score image", error);
        }
    }

    private boolean isPng(byte[] imageBytes) {
        if (imageBytes.length < PNG_SIGNATURE.length) {
            return false;
        }

        for (int index = 0; index < PNG_SIGNATURE.length; index++) {
            if (imageBytes[index] != PNG_SIGNATURE[index]) {
                return false;
            }
        }

        return true;
    }

    private void deleteExpiredImages(File shareDirectory) {
        File[] images = shareDirectory.listFiles();
        if (images == null) {
            return;
        }

        long expirationTime = System.currentTimeMillis() - MAX_IMAGE_AGE_MILLIS;
        for (File image : images) {
            if (
                image.isFile() &&
                image.getName().startsWith(SCORE_IMAGE_PREFIX) &&
                image.getName().endsWith(SCORE_IMAGE_SUFFIX) &&
                image.lastModified() < expirationTime
            ) {
                // Keep recent images available because share targets may read them after the chooser opens.
                image.delete();
            }
        }
    }
}
