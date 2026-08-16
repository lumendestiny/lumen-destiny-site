import UIKit
import WebKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate, WKNavigationDelegate {
    var window: UIWindow?
    private var webView: WKWebView!
    private let homeURL = URL(string: "https://lumendestiny.com/")!

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.allowsBackForwardNavigationGestures = true

        let controller = UIViewController()
        controller.view = webView
        controller.navigationItem.title = "Lumen Destiny"
        controller.navigationItem.leftBarButtonItem = UIBarButtonItem(
            image: UIImage(systemName: "chevron.backward"),
            style: .plain,
            target: self,
            action: #selector(goBack)
        )
        controller.navigationItem.rightBarButtonItems = [
            UIBarButtonItem(barButtonSystemItem: .action, target: self, action: #selector(sharePage)),
            UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(reloadPage))
        ]

        let navigation = UINavigationController(rootViewController: controller)
        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = navigation
        self.window = window
        window.makeKeyAndVisible()

        webView.load(URLRequest(url: homeURL, cachePolicy: .reloadRevalidatingCacheData, timeoutInterval: 30))
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }
        if url.scheme == "https", let host = url.host, host == "lumendestiny.com" || host.hasSuffix(".lumendestiny.com") {
            decisionHandler(.allow)
        } else {
            decisionHandler(.cancel)
            UIApplication.shared.open(url)
        }
    }

    @objc private func goBack() {
        if webView.canGoBack { webView.goBack() }
    }

    @objc private func reloadPage() {
        webView.reload()
    }

    @objc private func sharePage() {
        let url = webView.url ?? homeURL
        let activity = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        window?.rootViewController?.presentedViewController?.present(activity, animated: true)
            ?? window?.rootViewController?.present(activity, animated: true)
    }
}
