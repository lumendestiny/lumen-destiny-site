import UIKit
import WebKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate, WKNavigationDelegate {
    var window: UIWindow?
    private var webView: WKWebView!
    private weak var controller: UIViewController?
    private let homeURL = URL(string: "https://lumendestiny.com/")!
    private let privacyURL = URL(string: "https://lumendestiny.com/privacy.html")!
    private let supportEmail = "llumendestiny@gmail.com"
    private var recoveryAlertVisible = false

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.allowsBackForwardNavigationGestures = true

        let controller = UIViewController()
        self.controller = controller
        controller.view = webView
        controller.navigationItem.title = "Lumen Destiny"
        controller.navigationItem.leftBarButtonItem = UIBarButtonItem(
            image: UIImage(systemName: "chevron.backward"),
            style: .plain,
            target: self,
            action: #selector(goBack)
        )

        let moreMenu = UIMenu(children: [
            UIAction(title: "Privacy", image: UIImage(systemName: "hand.raised")) { [weak self] _ in
                self?.webView.load(URLRequest(url: self?.privacyURL ?? URL(string: "https://lumendestiny.com/privacy.html")!))
            },
            UIAction(title: "Support", image: UIImage(systemName: "envelope")) { [weak self] _ in
                self?.openSupportEmail()
            },
            UIAction(title: "Open in Safari", image: UIImage(systemName: "safari")) { [weak self] _ in
                guard let self else { return }
                UIApplication.shared.open(self.webView.url ?? self.homeURL)
            }
        ])

        controller.navigationItem.rightBarButtonItems = [
            UIBarButtonItem(image: UIImage(systemName: "ellipsis.circle"), menu: moreMenu),
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

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if let title = webView.title, !title.isEmpty {
            controller?.navigationItem.title = title
                .replacingOccurrences(of: " | 루멘 명운", with: "")
                .replacingOccurrences(of: " | Lumen Destiny", with: "")
        } else {
            controller?.navigationItem.title = "Lumen Destiny"
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        showRecoveryAlert()
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        showRecoveryAlert()
    }

    @objc private func goBack() {
        if webView.canGoBack {
            webView.goBack()
        } else {
            webView.load(URLRequest(url: homeURL))
        }
    }

    @objc private func reloadPage() {
        webView.reload()
    }

    @objc private func sharePage() {
        let url = webView.url ?? homeURL
        let activity = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        controller?.present(activity, animated: true)
    }

    private func openSupportEmail() {
        var components = URLComponents()
        components.scheme = "mailto"
        components.path = supportEmail
        components.queryItems = [URLQueryItem(name: "subject", value: "Lumen Destiny Support")]
        if let url = components.url {
            UIApplication.shared.open(url)
        }
    }

    private func showRecoveryAlert() {
        guard !recoveryAlertVisible, let controller else { return }
        recoveryAlertVisible = true
        let alert = UIAlertController(
            title: "Connection problem",
            message: "Lumen Destiny could not load this page. Check your connection and try again.",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "Retry", style: .default) { [weak self] _ in
            self?.recoveryAlertVisible = false
            self?.webView.reload()
        })
        alert.addAction(UIAlertAction(title: "Home", style: .cancel) { [weak self] _ in
            self?.recoveryAlertVisible = false
            guard let self else { return }
            self.webView.load(URLRequest(url: self.homeURL))
        })
        controller.present(alert, animated: true)
    }
}
