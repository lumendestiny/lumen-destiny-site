package com.lumendestiny.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.webkit.SafeBrowsingResponse;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final String HOME_URL = "https://lumendestiny.com/";
    private static final String PRIVACY_URL = "https://lumendestiny.com/privacy.html";
    private static final String SUPPORT_EMAIL = "llumendestiny@gmail.com";

    private WebView webView;
    private TextView titleView;
    private boolean errorDialogShowing = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.WHITE);

        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setOrientation(LinearLayout.HORIZONTAL);
        toolbar.setGravity(Gravity.CENTER_VERTICAL);
        toolbar.setPadding(dp(8), dp(6), dp(8), dp(6));
        toolbar.setBackgroundColor(Color.rgb(250, 250, 250));

        Button back = toolbarButton("‹", v -> goBack());
        Button home = toolbarButton("⌂", v -> webView.loadUrl(HOME_URL));
        titleView = new TextView(this);
        titleView.setText("Lumen Destiny");
        titleView.setTextSize(16f);
        titleView.setTextColor(Color.rgb(28, 28, 30));
        titleView.setGravity(Gravity.CENTER);
        titleView.setSingleLine(true);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(0, dp(44), 1f);

        Button refresh = toolbarButton("↻", v -> webView.reload());
        Button share = toolbarButton("Share", v -> shareCurrentPage());
        Button more = toolbarButton("⋯", v -> showMoreMenu());

        toolbar.addView(back);
        toolbar.addView(home);
        toolbar.addView(titleView, titleParams);
        toolbar.addView(refresh);
        toolbar.addView(share);
        toolbar.addView(more);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.WHITE);
        root.addView(toolbar, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT));
        root.addView(webView, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f));
        setContentView(root);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSafeBrowsingEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUri(request.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                String pageTitle = view.getTitle();
                if (pageTitle != null && !pageTitle.trim().isEmpty()) {
                    titleView.setText(pageTitle.replace(" | 루멘 명운", "").replace(" | Lumen Destiny", ""));
                } else {
                    titleView.setText("Lumen Destiny");
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showRecoveryDialog();
                }
            }

            @Override
            public void onSafeBrowsingHit(WebView view, WebResourceRequest request, int threatType, SafeBrowsingResponse callback) {
                callback.backToSafety(true);
            }
        });

        if (savedInstanceState == null) {
            webView.loadUrl(HOME_URL);
        } else if (webView.restoreState(savedInstanceState) == null) {
            webView.loadUrl(HOME_URL);
        }
    }

    private Button toolbarButton(String text, View.OnClickListener listener) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextSize(text.length() > 2 ? 12f : 20f);
        button.setMinWidth(0);
        button.setMinimumWidth(0);
        button.setAllCaps(false);
        button.setOnClickListener(listener);
        button.setContentDescription(text);
        button.setLayoutParams(new LinearLayout.LayoutParams(dp(text.length() > 2 ? 58 : 46), dp(44)));
        return button;
    }

    private void goBack() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            finish();
        }
    }

    private void shareCurrentPage() {
        String url = webView != null && webView.getUrl() != null ? webView.getUrl() : HOME_URL;
        Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("text/plain");
        share.putExtra(Intent.EXTRA_TEXT, url);
        startActivity(Intent.createChooser(share, "Share Lumen Destiny"));
    }

    private void showMoreMenu() {
        String[] items = {"Privacy", "Support", "Open in browser"};
        new AlertDialog.Builder(this)
                .setTitle("Lumen Destiny")
                .setItems(items, (dialog, which) -> {
                    if (which == 0) {
                        webView.loadUrl(PRIVACY_URL);
                    } else if (which == 1) {
                        Intent email = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:" + SUPPORT_EMAIL));
                        email.putExtra(Intent.EXTRA_SUBJECT, "Lumen Destiny Support");
                        try {
                            startActivity(email);
                        } catch (Exception ignored) {
                        }
                    } else {
                        String url = webView.getUrl() != null ? webView.getUrl() : HOME_URL;
                        try {
                            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                        } catch (Exception ignored) {
                        }
                    }
                })
                .show();
    }

    private void showRecoveryDialog() {
        if (isFinishing() || errorDialogShowing) return;
        errorDialogShowing = true;
        new AlertDialog.Builder(this)
                .setTitle("Connection problem")
                .setMessage("Lumen Destiny could not load this page. Check your connection and try again.")
                .setPositiveButton("Retry", (dialog, which) -> {
                    errorDialogShowing = false;
                    webView.reload();
                })
                .setNegativeButton("Home", (dialog, which) -> {
                    errorDialogShowing = false;
                    webView.loadUrl(HOME_URL);
                })
                .setOnCancelListener(dialog -> errorDialogShowing = false)
                .show();
    }

    private boolean handleUri(Uri uri) {
        String scheme = uri.getScheme();
        String host = uri.getHost();
        if ("https".equalsIgnoreCase(scheme) && host != null
                && (host.equals("lumendestiny.com") || host.endsWith(".lumendestiny.com"))) {
            return false;
        }
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (Exception ignored) {
        }
        return true;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        goBack();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.removeAllViews();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
