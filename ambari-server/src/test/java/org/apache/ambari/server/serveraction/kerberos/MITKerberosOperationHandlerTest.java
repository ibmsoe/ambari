/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ambari.server.serveraction.kerberos;

import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import junit.framework.Assert;
import org.apache.ambari.server.AmbariException;
import org.apache.ambari.server.configuration.Configuration;
import org.apache.ambari.server.state.Clusters;
import org.apache.ambari.server.utils.ShellCommandUtil;
import org.easymock.EasyMock;
import org.easymock.IAnswer;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.easymock.EasyMock.anyObject;
import static org.easymock.EasyMock.expect;
import static org.easymock.EasyMock.replay;

public class MITKerberosOperationHandlerTest extends KerberosOperationHandlerTest {

  private static final String DEFAULT_ADMIN_PRINCIPAL = "admin/admin";
  private static final String DEFAULT_ADMIN_PASSWORD = "hadoop";
  private static final String DEFAULT_REALM = "EXAMPLE.COM";

  private static Injector injector;

  private static final Map<String, String> KERBEROS_ENV_MAP = new HashMap<String, String>() {
    {
      put(MITKerberosOperationHandler.KERBEROS_ENV_ENCRYPTION_TYPES, null);
      put(MITKerberosOperationHandler.KERBEROS_ENV_KDC_HOST, "localhost");
      put(MITKerberosOperationHandler.KERBEROS_ENV_ADMIN_SERVER_HOST, "localhost");
    }
  };

  @BeforeClass
  public static void beforeClass() throws AmbariException {
    injector = Guice.createInjector(new AbstractModule() {
      @Override
      protected void configure() {
        Configuration configuration =EasyMock.createNiceMock(Configuration.class);
        expect(configuration.getServerOsFamily()).andReturn("redhat6").anyTimes();
        replay(configuration);

        bind(Clusters.class).toInstance(EasyMock.createNiceMock(Clusters.class));
        bind(Configuration.class).toInstance(configuration);
      }
    });
  }

  @Test
  public void testSetPrincipalPasswordExceptions() throws Exception {
    MITKerberosOperationHandler handler = injector.getInstance(MITKerberosOperationHandler.class);
    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);

    try {
      handler.setPrincipalPassword(DEFAULT_ADMIN_PRINCIPAL, null);
      Assert.fail("KerberosOperationException not thrown for null password");
    } catch (Throwable t) {
      Assert.assertEquals(KerberosOperationException.class, t.getClass());
    }

    try {
      handler.setPrincipalPassword(DEFAULT_ADMIN_PRINCIPAL, "");
      Assert.fail("KerberosOperationException not thrown for empty password");
      handler.createPrincipal("", "1234", false);
      Assert.fail("AmbariException not thrown for empty principal");
    } catch (Throwable t) {
      Assert.assertEquals(KerberosOperationException.class, t.getClass());
    }

    try {
      handler.setPrincipalPassword(null, DEFAULT_ADMIN_PASSWORD);
      Assert.fail("KerberosOperationException not thrown for null principal");
    } catch (Throwable t) {
      Assert.assertEquals(KerberosOperationException.class, t.getClass());
    }

    try {
      handler.setPrincipalPassword("", DEFAULT_ADMIN_PASSWORD);
      Assert.fail("KerberosOperationException not thrown for empty principal");
    } catch (Throwable t) {
      Assert.assertEquals(KerberosOperationException.class, t.getClass());
    }
  }

  @Test
  public void testCreateServicePrincipalExceptions() throws Exception {
    MITKerberosOperationHandler handler = new MITKerberosOperationHandler();
    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);

    try {
      handler.createPrincipal(DEFAULT_ADMIN_PRINCIPAL, null, false);
      Assert.fail("KerberosOperationException not thrown for null password");
    } catch (Throwable t) {
      Assert.assertEquals(KerberosOperationException.class, t.getClass());
    }

    try {
      handler.createPrincipal(DEFAULT_ADMIN_PRINCIPAL, "", false);
      Assert.fail("KerberosOperationException not thrown for empty password");
    } catch (Throwable t) {
      Assert.assertEquals(KerberosOperationException.class, t.getClass());
    }

    try {
      handler.createPrincipal(null, DEFAULT_ADMIN_PASSWORD, false);
      Assert.fail("KerberosOperationException not thrown for null principal");
    } catch (Throwable t) {
      Assert.assertEquals(KerberosOperationException.class, t.getClass());
    }

    try {
      handler.createPrincipal("", DEFAULT_ADMIN_PASSWORD, false);
      Assert.fail("KerberosOperationException not thrown for empty principal");
    } catch (Throwable t) {
      Assert.assertEquals(KerberosOperationException.class, t.getClass());
    }
  }

  @Test(expected = KerberosAdminAuthenticationException.class)
  public void testTestAdministratorCredentialsIncorrectAdminPassword() throws Exception {
    MITKerberosOperationHandler handler = createMockBuilder(MITKerberosOperationHandler.class)
        .addMockedMethod(KerberosOperationHandler.class.getDeclaredMethod("executeCommand", String[].class))
        .createNiceMock();

    setConfiguration(handler, "redhat6");

    expect(handler.executeCommand(anyObject(String[].class)))
        .andAnswer(new IAnswer<ShellCommandUtil.Result>() {
          @Override
          public ShellCommandUtil.Result answer() throws Throwable {
            ShellCommandUtil.Result result = createMock(ShellCommandUtil.Result.class);

            expect(result.getExitCode()).andReturn(1).anyTimes();
            expect(result.isSuccessful()).andReturn(false).anyTimes();
            expect(result.getStderr())
                .andReturn("kadmin: Incorrect password while initializing kadmin interface")
                .anyTimes();
            expect(result.getStdout())
                .andReturn("Authenticating as principal admin/admin with password.")
                .anyTimes();

            replay(result);
            return result;
          }
        });

    replayAll();

    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);
    handler.testAdministratorCredentials();
    handler.close();
  }

  @Test(expected = KerberosAdminAuthenticationException.class)
  public void testTestAdministratorCredentialsIncorrectAdminPrincipal() throws Exception {
    MITKerberosOperationHandler handler = createMockBuilder(MITKerberosOperationHandler.class)
        .addMockedMethod(KerberosOperationHandler.class.getDeclaredMethod("executeCommand", String[].class))
        .createNiceMock();

    setConfiguration(handler, "redhat6");

    expect(handler.executeCommand(anyObject(String[].class)))
        .andAnswer(new IAnswer<ShellCommandUtil.Result>() {
          @Override
          public ShellCommandUtil.Result answer() throws Throwable {
            ShellCommandUtil.Result result = createMock(ShellCommandUtil.Result.class);

            expect(result.getExitCode()).andReturn(1).anyTimes();
            expect(result.isSuccessful()).andReturn(false).anyTimes();
            expect(result.getStderr())
                .andReturn("kadmin: Client not found in Kerberos database while initializing kadmin interface")
                .anyTimes();
            expect(result.getStdout())
                .andReturn("Authenticating as principal admin/admin with password.")
                .anyTimes();

            replay(result);
            return result;
          }
        });

    replayAll();

    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);
    handler.testAdministratorCredentials();
    handler.close();
  }

  @Test(expected = KerberosRealmException.class)
  public void testTestAdministratorCredentialsInvalidRealm() throws Exception {
    MITKerberosOperationHandler handler = createMockBuilder(MITKerberosOperationHandler.class)
        .addMockedMethod(KerberosOperationHandler.class.getDeclaredMethod("executeCommand", String[].class))
        .createNiceMock();

    setConfiguration(handler, "redhat6");

    expect(handler.executeCommand(anyObject(String[].class)))
        .andAnswer(new IAnswer<ShellCommandUtil.Result>() {
          @Override
          public ShellCommandUtil.Result answer() throws Throwable {
            ShellCommandUtil.Result result = createMock(ShellCommandUtil.Result.class);

            expect(result.getExitCode()).andReturn(1).anyTimes();
            expect(result.isSuccessful()).andReturn(false).anyTimes();
            expect(result.getStderr())
                .andReturn("kadmin: Missing parameters in krb5.conf required for kadmin client while initializing kadmin interface")
                .anyTimes();
            expect(result.getStdout())
                .andReturn("Authenticating as principal admin/admin with password.")
                .anyTimes();

            replay(result);
            return result;
          }
        });

    replayAll();

    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);
    handler.testAdministratorCredentials();
    handler.close();
  }

  @Test(expected = KerberosRealmException.class)
  public void testTestAdministratorCredentialsInvalidRealm2() throws Exception {
    MITKerberosOperationHandler handler = createMockBuilder(MITKerberosOperationHandler.class)
        .addMockedMethod(KerberosOperationHandler.class.getDeclaredMethod("executeCommand", String[].class))
        .createNiceMock();

    setConfiguration(handler, "redhat6");

    expect(handler.executeCommand(anyObject(String[].class)))
        .andAnswer(new IAnswer<ShellCommandUtil.Result>() {
          @Override
          public ShellCommandUtil.Result answer() throws Throwable {
            ShellCommandUtil.Result result = createMock(ShellCommandUtil.Result.class);

            expect(result.getExitCode()).andReturn(1).anyTimes();
            expect(result.isSuccessful()).andReturn(false).anyTimes();
            expect(result.getStderr())
                .andReturn("kadmin: Cannot find KDC for requested realm while initializing kadmin interface")
                .anyTimes();
            expect(result.getStdout())
                .andReturn("Authenticating as principal admin/admin with password.")
                .anyTimes();

            replay(result);
            return result;
          }
        });

    replayAll();

    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);
    handler.testAdministratorCredentials();
    handler.close();
  }

  @Test(expected = KerberosKDCConnectionException.class)
  public void testTestAdministratorCredentialsKDCConnectionException() throws Exception {
    MITKerberosOperationHandler handler = createMockBuilder(MITKerberosOperationHandler.class)
        .addMockedMethod(KerberosOperationHandler.class.getDeclaredMethod("executeCommand", String[].class))
        .createNiceMock();

    setConfiguration(handler, "redhat6");

    expect(handler.executeCommand(anyObject(String[].class)))
        .andAnswer(new IAnswer<ShellCommandUtil.Result>() {
          @Override
          public ShellCommandUtil.Result answer() throws Throwable {
            ShellCommandUtil.Result result = createMock(ShellCommandUtil.Result.class);

            expect(result.getExitCode()).andReturn(1).anyTimes();
            expect(result.isSuccessful()).andReturn(false).anyTimes();
            expect(result.getStderr())
                .andReturn("kadmin: Cannot contact any KDC for requested realm while initializing kadmin interface")
                .anyTimes();
            expect(result.getStdout())
                .andReturn("Authenticating as principal admin/admin with password.")
                .anyTimes();

            replay(result);
            return result;
          }
        });

    replayAll();

    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);
    handler.testAdministratorCredentials();
    handler.close();
  }

  @Test(expected = KerberosKDCConnectionException.class)
  public void testTestAdministratorCredentialsKDCConnectionException2() throws Exception {
    MITKerberosOperationHandler handler = createMockBuilder(MITKerberosOperationHandler.class)
        .addMockedMethod(KerberosOperationHandler.class.getDeclaredMethod("executeCommand", String[].class))
        .createNiceMock();

    setConfiguration(handler, "redhat6");

    expect(handler.executeCommand(anyObject(String[].class)))
        .andAnswer(new IAnswer<ShellCommandUtil.Result>() {
          @Override
          public ShellCommandUtil.Result answer() throws Throwable {
            ShellCommandUtil.Result result = createMock(ShellCommandUtil.Result.class);

            expect(result.getExitCode()).andReturn(1).anyTimes();
            expect(result.isSuccessful()).andReturn(false).anyTimes();
            expect(result.getStderr())
                .andReturn("kadmin: Cannot resolve network address for admin server in requested realm while initializing kadmin interface")
                .anyTimes();
            expect(result.getStdout())
                .andReturn("Authenticating as principal admin/admin with password.")
                .anyTimes();

            replay(result);
            return result;
          }
        });

    replayAll();

    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);
    handler.testAdministratorCredentials();
    handler.close();
  }

  @Test
  public void testTestAdministratorCredentialsNotFound() throws Exception {
    MITKerberosOperationHandler handler = createMockBuilder(MITKerberosOperationHandler.class)
        .addMockedMethod(KerberosOperationHandler.class.getDeclaredMethod("executeCommand", String[].class))
        .createNiceMock();

    setConfiguration(handler, "redhat6");

    expect(handler.executeCommand(anyObject(String[].class)))
        .andAnswer(new IAnswer<ShellCommandUtil.Result>() {
          @Override
          public ShellCommandUtil.Result answer() throws Throwable {
            ShellCommandUtil.Result result = createMock(ShellCommandUtil.Result.class);

            expect(result.getExitCode()).andReturn(0).anyTimes();
            expect(result.isSuccessful()).andReturn(true).anyTimes();
            expect(result.getStderr())
                .andReturn("get_principal: Principal does not exist while retrieving \"admin/admi@EXAMPLE.COM\".")
                .anyTimes();
            expect(result.getStdout())
                .andReturn("Authenticating as principal admin/admin with password.")
                .anyTimes();

            replay(result);
            return result;
          }
        });

    replayAll();

    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);
    Assert.assertFalse(handler.testAdministratorCredentials());
    handler.close();
  }

  @Test
  public void testTestAdministratorCredentialsSuccess() throws Exception {
    MITKerberosOperationHandler handler = createMockBuilder(MITKerberosOperationHandler.class)
        .addMockedMethod(KerberosOperationHandler.class.getDeclaredMethod("executeCommand", String[].class))
        .createNiceMock();

    setConfiguration(handler, "redhat6");

    expect(handler.executeCommand(anyObject(String[].class)))
        .andAnswer(new IAnswer<ShellCommandUtil.Result>() {
          @Override
          public ShellCommandUtil.Result answer() throws Throwable {
            ShellCommandUtil.Result result = createMock(ShellCommandUtil.Result.class);

            expect(result.getExitCode()).andReturn(0).anyTimes();
            expect(result.isSuccessful()).andReturn(true).anyTimes();
            expect(result.getStderr())
                .andReturn("")
                .anyTimes();
            expect(result.getStdout())
                .andReturn("Authenticating as principal admin/admin with password.\n" +
                    "Principal: admin/admin@EXAMPLE.COM\n" +
                    "Expiration date: [never]\n" +
                    "Last password change: Thu Jan 08 13:09:52 UTC 2015\n" +
                    "Password expiration date: [none]\n" +
                    "Maximum ticket life: 1 day 00:00:00\n" +
                    "Maximum renewable life: 0 days 00:00:00\n" +
                    "Last modified: Thu Jan 08 13:09:52 UTC 2015 (root/admin@EXAMPLE.COM)\n" +
                    "Last successful authentication: [never]\n" +
                    "Last failed authentication: [never]\n" +
                    "Failed password attempts: 0\n" +
                    "Number of keys: 6\n" +
                    "Key: vno 1, aes256-cts-hmac-sha1-96, no salt\n" +
                    "Key: vno 1, aes128-cts-hmac-sha1-96, no salt\n" +
                    "Key: vno 1, des3-cbc-sha1, no salt\n" +
                    "Key: vno 1, arcfour-hmac, no salt\n" +
                    "Key: vno 1, des-hmac-sha1, no salt\n" +
                    "Key: vno 1, des-cbc-md5, no salt\n" +
                    "MKey: vno 1\n" +
                    "Attributes:\n" +
                    "Policy: [none]")
                .anyTimes();

            replay(result);
            return result;
          }
        });

    replayAll();

    handler.open(new KerberosCredential(DEFAULT_ADMIN_PRINCIPAL, DEFAULT_ADMIN_PASSWORD, null), DEFAULT_REALM, KERBEROS_ENV_MAP);
    handler.testAdministratorCredentials();
    handler.close();
  }

  @Test
  @Ignore
  public void testTestAdministratorCredentialsLive() throws KerberosOperationException {
    MITKerberosOperationHandler handler = new MITKerberosOperationHandler();
    String principal = System.getProperty("principal");
    String password = System.getProperty("password");
    String realm = System.getProperty("realm");

    if (principal == null) {
      principal = DEFAULT_ADMIN_PRINCIPAL;
    }

    if (password == null) {
      password = DEFAULT_ADMIN_PASSWORD;
    }

    if (realm == null) {
      realm = DEFAULT_REALM;
    }

    KerberosCredential credentials = new KerberosCredential(principal, password, null);

    handler.open(credentials, realm, KERBEROS_ENV_MAP);
    handler.testAdministratorCredentials();
    handler.close();
  }

  private static void setConfiguration(MITKerberosOperationHandler handler, String osType) throws Exception {
    Configuration configuration = EasyMock.createNiceMock(Configuration.class);
    expect(configuration.getServerOsFamily()).andReturn("redhat6").anyTimes();
    replay(configuration);

    handler.init(configuration);
  }
}